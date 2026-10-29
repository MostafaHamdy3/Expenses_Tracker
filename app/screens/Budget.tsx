import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import i18n from '../assets/translation/config'
import { nFormatter } from '../utility/utility'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { appLanguage } from '../assets/translation/resources'
import { fonts } from '../../src/theme/fonts'
import { useTheme } from '../../src/theme/useTheme'

import { CircularProgress } from 'react-native-circular-progress';
import { RootStackParamList } from '../AppNavigation'
import { useExpenseStore } from '../store/ExpenseStore'
import { useUserStore } from '../store/UserStore'
import AddOrUpdateBudget, { AddOrUpdateBudgetHandle } from '../components/modals/AddOrUpdateBudget'
import { NavigationHeader } from '../components/common/NavigationHeader'
import { Button } from '../components/common/Button'
import Edit from '../assets/svgs/square-pen.svg';

const sectionTitle = `text-[18px] text-mainColor ${fonts.medium}`;

const Budget = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getExpensesTotal } = useExpenseStore();
  const { userBudget, getUserBudget } = useUserStore();
  const { getThemeColor } = useTheme();

  const [expensesPrice, setExpensesPrice] = useState<number>(0);

  const budgetModalRef = useRef<AddOrUpdateBudgetHandle>(null);

  const currentDate = new Date();
  const locale = appLanguage;
  const currentMonth = currentDate.toLocaleString(locale, { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      await getUserBudget();
    }
    fetchData();
  }, []);

  useFocusEffect(useCallback(() => {
    getExpensesTotal("month").then(setExpensesPrice);
  }, []));

  const expensesDetails = () => {
    navigation.navigate('ExpensesOverview', { screen: 'Expenses' });
  };

  const budgetHandler = useCallback(() => {
    budgetModalRef.current?.present();
  }, []);

  const remainder = ((userBudget - expensesPrice) / userBudget * 100).toFixed(2);

  return (
    <View className="flex-1 bg-bgScreen">
      <NavigationHeader
        title={i18n.t("budget")}
        showLogoutIcon={true}
      />
      <AddOrUpdateBudget
        ref={budgetModalRef}
        userBudget={userBudget}
      />
      <View className="w-[92%] self-center items-center pt-6">
        <Text className={`text-[20px] ${fonts.medium} mb-3`}>{currentMonth} {currentYear}</Text>
        <View className="w-full self-center flex-row justify-between items-center gap-2 bg-bgContainer border border-borderColor rounded-xl py-2.5 px-4">
          <Text className={sectionTitle}>{i18n.t("budget")}</Text>
          <Text className="text-[24px] font-num-bold">${userBudget}</Text>
          <TouchableOpacity onPress={budgetHandler}>
            <Edit width={20} height={20} color={getThemeColor("mainColor")} />
          </TouchableOpacity>
        </View>

        <View className="mt-[20%]">
          <CircularProgress
            size={160}
            width={15}
            fill={Math.max(+remainder, 0)}
            tintColor={getThemeColor("primaryColor")}
            backgroundColor={getThemeColor("borderColor")}
          >
            {fill => 
              <>
                <Text className={`text-[16px] text-mainColor ${fonts.medium}`}>{i18n.t("remainder")}</Text>
                <Text className="text-center text-[20px] text-mainColor font-num-bold">{fill}%</Text>
              </>
            }
          </CircularProgress>
        </View>

        <View className="flex-row items-center gap-2 mt-6">
          <Text className={sectionTitle}>{i18n.t("uExpenses")}:</Text>
          <Text className="text-[18px] font-num-bold mb-px">{nFormatter(+expensesPrice)}$</Text>
        </View>

      </View>
      <View className="w-full absolute bottom-10.5">
        <Button
          btnText={i18n.t("expensesDetails")}
          customStyle="w-[92%] self-center mt-5"
          textStyle="text-[16px]"
          onPress={expensesDetails}
        />
      </View>
    </View>
  )
}

export default Budget
