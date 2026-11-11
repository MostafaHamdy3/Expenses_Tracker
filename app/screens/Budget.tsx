import React, { useCallback, useRef } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { SvgProps } from 'react-native-svg'

import i18n from '../assets/translation/config'
import { appLanguage } from '../assets/translation/resources'
import { formatMoney } from '../utility/utility'
import { cn } from '../../src/utils/cn'
import { fonts } from '../../src/theme/fonts'
import { useTheme } from '../../src/theme/useTheme'
import { ThemeColor } from '../../src/theme/colors'
import { RootStackParamList } from '../AppNavigation'
import { useExpensesTotal } from '../hooks/useExpenses'
import { useUserBudget } from '../hooks/useUser'
import AddOrUpdateBudget, { AddOrUpdateBudgetHandle } from '../components/modals/AddOrUpdateBudget'
import { NavigationHeader } from '../components/common/NavigationHeader'
import { Button } from '../components/common/Button'
import { Indicator } from '../components/common/Indicator'
import Edit from '../assets/svgs/square-pen.svg'
import Banknote from '../assets/svgs/banknote-arrow-down.svg'
import Coins from '../assets/svgs/hand-coins.svg'
import TrendingUp from '../assets/svgs/trending-up.svg'

type BudgetStatus = 'onTrack' | 'spendingFast' | 'overBudget';

// How far spending may run ahead of the month's progress before we warn.
const PACE_TOLERANCE = 0.1;

const statusColor: Record<BudgetStatus, ThemeColor> = {
  onTrack: 'primaryColor',
  spendingFast: 'warning',
  overBudget: 'error500',
};

const statusText: Record<BudgetStatus, string> = {
  onTrack: 'text-primaryColor',
  spendingFast: 'text-warning',
  overBudget: 'text-error500',
};

const card = 'bg-bgContainer border border-borderColor rounded-2xl';

type StatTileProps = {
  Icon: React.FC<SvgProps>;
  label: string;
  value: string;
  onPress?: () => void;
};

const StatTile = ({ Icon, label, value, onPress }: StatTileProps) => {
  const { getThemeColor } = useTheme();

  return (
    <TouchableOpacity
      className={`${card} flex-row items-center px-4 py-3.5`}
      activeOpacity={0.7}
      disabled={!onPress}
      onPress={onPress}
    >
      <View className="w-9 h-9 rounded-full items-center justify-center bg-bgScreen me-3">
        <Icon width={18} height={18} color={getThemeColor('placeholderColor')} />
      </View>
      <Text className={`flex-1 text-[15px] text-placeholderColor text-start ${fonts.medium}`}>{label}</Text>
      <Text className="text-[17px] text-mainColor font-num-bold" numberOfLines={1}>
        {value}
      </Text>
      {onPress && (
        <View className="ms-3">
          <Edit width={16} height={16} color={getThemeColor('primaryColor')} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const Budget = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: userBudget = 0, isPending: budgetPending } = useUserBudget();
  const { data: spent = 0 } = useExpensesTotal('month');
  const { getThemeColor } = useTheme();

  const budgetModalRef = useRef<AddOrUpdateBudgetHandle>(null);

  const openBudgetSheet = useCallback(() => {
    budgetModalRef.current?.present();
  }, []);

  const goToExpenses = () => {
    navigation.navigate('ExpensesOverview', { screen: 'Expenses' });
  };

  // Month math
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate() + 1;
  const monthLabel = today.toLocaleDateString(
    appLanguage === 'ar' ? 'ar-u-nu-latn' : 'en-US',
    { month: 'long', year: 'numeric' },
  );

  // Budget math
  const hasBudget = userBudget > 0;
  const remaining = userBudget - spent;
  const spentRatio = hasBudget ? spent / userBudget : 0;
  const monthRatio = today.getDate() / daysInMonth;
  const status: BudgetStatus =
    remaining < 0 ? 'overBudget'
      : spentRatio > monthRatio + PACE_TOLERANCE ? 'spendingFast'
      : 'onTrack';
  // The ring empties as money is spent; once over budget it shows full and red.
  const ringFill = status === 'overBudget' ? 100 : Math.max(0, (remaining / userBudget) * 100);
  const perDay = Math.max(remaining, 0) / daysLeft;
  const usedPercent = Math.round(spentRatio * 100);

  const renderEmptyState = () => (
    <View className={`${card} items-center px-6 py-8`}>
      <Image
        source={require('../assets/icons/specify_budget.jpg')}
        className="w-36 h-36 rounded-3xl"
      />
      <Text className={`text-[20px] text-mainColor text-center ${fonts.bold} mt-6`}>
        {i18n.t('noBudgetTitle')}
      </Text>
      <Text className={`text-[15px] text-placeholderColor text-center ${fonts.regular} mt-2 leading-5.5`}>
        {i18n.t('noBudgetDescription')}
      </Text>
      <Button
        btnText={i18n.t('setBudget')}
        onPress={openBudgetSheet}
        customStyle="w-full h-13 m-0 mt-6 rounded-2xl"
        textStyle={`text-[16px] ${fonts.bold}`}
      />
    </View>
  );

  const renderOverview = () => (
    <>
      {/* Remaining money ring */}
      <View className={`${card} items-center px-4 pt-6 pb-5`}>
        <AnimatedCircularProgress
          size={200}
          width={14}
          backgroundWidth={14}
          fill={ringFill}
          rotation={0}
          lineCap="round"
          duration={700}
          tintColor={getThemeColor(statusColor[status])}
          backgroundColor={getThemeColor('borderColor')}
        >
          {() => (
            <View className="items-center px-6">
              <Text
                className={cn('text-[30px] font-num-bold', status === 'overBudget' ? 'text-error500' : 'text-mainColor')}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatMoney(Math.abs(remaining))}
              </Text>
              <Text className={`text-[14px] text-placeholderColor text-center ${fonts.medium} mt-1`}>
                {status === 'overBudget'
                  ? i18n.t('overBy', { amount: formatMoney(userBudget) })
                  : i18n.t('left', { amount: formatMoney(userBudget) })}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>

        <View className="flex-row items-center gap-2 mt-5">
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getThemeColor(statusColor[status]) }}
          />
          <Text className={cn(`text-[15px] ${fonts.medium}`, statusText[status])}>
            {i18n.t(status)}
          </Text>
        </View>
        <Text className={`text-[13px] text-placeholderColor ${fonts.regular} mt-1`}>
          {i18n.t('usedPercent', { percent: usedPercent })}
        </Text>
      </View>

      {/* Key numbers */}
      <View className="gap-3 mt-4">
        <StatTile Icon={Banknote} label={i18n.t('Budget')} value={formatMoney(userBudget)} onPress={openBudgetSheet} />
        <StatTile Icon={Coins} label={i18n.t('spent')} value={formatMoney(spent)} />
        <StatTile Icon={TrendingUp} label={i18n.t('perDay')} value={formatMoney(Math.floor(perDay * 100) / 100)} />
      </View>
    </>
  );

  return (
    <View className="flex-1 bg-bgScreen">
      <NavigationHeader title={i18n.t('Budget')} />
      <AddOrUpdateBudget ref={budgetModalRef} userBudget={userBudget} />

      {budgetPending ? (
        <Indicator />
      ) : (
        <>
          <ScrollView className="flex-1" contentContainerClassName="px-4 pt-5 pb-6">
            <View className="flex-row items-end justify-between mb-4 mx-1">
              <Text className={`text-[22px] text-mainColor ${fonts.bold}`}>{monthLabel}</Text>
              <Text className={`text-[14px] text-placeholderColor ${fonts.medium} mb-1`}>
                {daysLeft === 1 ? i18n.t('dayLeft') : i18n.t('daysLeft', { count: daysLeft })}
              </Text>
            </View>
            {hasBudget ? renderOverview() : renderEmptyState()}
          </ScrollView>

          {hasBudget && (
            <View className="px-4 pt-3 pb-4">
              <Button
                btnText={i18n.t('expensesDetails')}
                onPress={goToExpenses}
                customStyle="w-full h-13 m-0 rounded-2xl bg-bgContainer border border-borderColor"
                textStyle={`text-[16px] text-mainColor ${fonts.medium}`}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default Budget
