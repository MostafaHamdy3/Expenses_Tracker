import React, { useCallback, useEffect, useRef } from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'

import i18n from '../assets/translation/config'
import { Colors } from '../constants/Styles'
import { expensesSum, nFormatter, ThisMonthExpenses } from '../utility/utility'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { fontsAR, fontsEN, fontsNUM } from '../constants/config'
import { isRTL } from '../assets/translation/resources'

import { CircularProgress } from 'react-native-circular-progress';
import { RootStackParamList } from '../AppNavigation'
import { useExpenseStore } from '../store/ExpenseStore'
import { useUserStore } from '../store/UserStore'
import AddOrUpdateBudget, { AddOrUpdateBudgetHandle } from '../components/modals/AddOrUpdateBudget'
import { NavigationHeader } from '../components/common/NavigationHeader'
import { Button } from '../components/common/Button'
import Edit from '../assets/svgs/square-pen.svg';

const Budget = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { expenses } = useExpenseStore();
  const { userBudget, getUserBudget } = useUserStore();

  const recentExpenses = ThisMonthExpenses(expenses);
  const expensesPrice = expensesSum(recentExpenses);

  const budgetModalRef = useRef<AddOrUpdateBudgetHandle>(null);

  const currentDate = new Date();
  const locale = isRTL() ? 'ar' : 'en';
  const currentMonth = currentDate.toLocaleString(locale, { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      await getUserBudget();
    }
    fetchData();
  }, []);

  const expensesDetails = () => {
    navigation.navigate('ExpensesOverview', { screen: 'RecentExpenses' });
  };

  const budgetHandler = useCallback(() => {
    budgetModalRef.current?.present();
  }, []);

  const remainder = ((userBudget - expensesPrice) / userBudget * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={i18n.t("budget")}
        showLogoutIcon={true}
      />
      <AddOrUpdateBudget
        ref={budgetModalRef}
        userBudget={userBudget}
      />
      <View style={styles.content}>
        <Text style={styles.monthTitle}>{currentMonth} {currentYear}</Text>
        <View style={styles.budgetContainer}>
          <Text style={styles.sectionTitle}>{i18n.t("budget")}</Text>
          <Text style={styles.budgetAmount}>${userBudget}</Text>
          <TouchableOpacity onPress={budgetHandler}>
            <Edit width={20} height={20} color={Colors.mainColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <CircularProgress
            size={160}
            width={15}
            fill={Math.max(+remainder, 0)}
            tintColor={Colors.primaryColor}
            backgroundColor={Colors.borderColor}
          >
            {fill => 
              <>
                <Text style={styles.progressText}>{i18n.t("remainder")}</Text>
                <Text style={styles.progressPercentage}>{fill}%</Text>
              </>
            }
          </CircularProgress>
        </View>

        <View style={styles.uExpensesContent}>
          <Text style={styles.sectionTitle}>{i18n.t("uExpenses")}:</Text>
          <Text style={styles.budgetPrice}>{nFormatter(+expensesPrice)}$</Text>
        </View>

      </View>
      <View style={styles.btnContainer}>
        <Button
          btnText={i18n.t("expensesDetails")}
          btnStyle={styles.detailsBtn}
          textStyle={styles.detailsBtnText}
          onPress={expensesDetails}
        />
      </View>
    </View>
  )
}

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  budgetContainer: ViewStyle;
  sectionTitle: TextStyle;
  budgetAmount: TextStyle;
  monthTitle: TextStyle;
  progressContainer: ViewStyle;
  progressText: TextStyle;
  progressPercentage: TextStyle;
  uExpensesContent: ViewStyle;
  budgetPrice: TextStyle;
  btnContainer: ViewStyle;
  detailsBtn: ViewStyle;
  detailsBtnText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: Colors.bgScreen,
  },
  content: {
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    marginBottom: 12,
  },
  budgetContainer: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: isRTL() ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgContainer,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.mainColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  budgetAmount: {
    fontSize: 24,
    fontFamily: fontsNUM.bold,
  },
  progressContainer: {
    marginTop: "20%",
  },
  progressText: {
    fontSize: 16,
    color: Colors.mainColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  progressPercentage: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.mainColor,
    fontFamily: fontsNUM.bold,
  },
  uExpensesContent: {
    flexDirection: isRTL() ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  budgetPrice: {
    fontSize: 18,
    fontFamily: fontsNUM.bold,
    marginBottom: 1,
  },
  btnContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 42,
  },
  detailsBtn: {
    width: '92%',
    alignSelf: 'center',
    marginTop: 20,
  },
  detailsBtnText: {
    fontSize: 16,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  }
})

export default Budget
