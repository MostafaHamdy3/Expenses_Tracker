import React from "react";
import { StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ExpenseItemProps } from "./components/ExpenseItem";
import { Colors } from "./constants/Styles";
import { isRTL } from "./assets/translation/resources";
import { fontsAR, fontsEN } from "./constants/config";
import { RecentExpenses } from "./screens/RecentExpenses";
import i18n from "./assets/translation/config";
import { ManageExpense } from "./screens/ManageExpense";
import Budget from "./screens/Budget";
import { AllExpenses } from "./screens/AllExpenses";
import { Splash } from "./screens/Splash";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import BadgePlus from "./assets/svgs/badge-plus.svg";
import Banknote from "./assets/svgs/banknote-arrow-down.svg";
import Coins from "./assets/svgs/hand-coins.svg";
import Trending from "./assets/svgs/trending-up.svg";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  ExpensesOverview: { screen: keyof ExpensesOverviewParamList, data?: ExpenseItemProps } | undefined;
  ManageExpense: { data: ExpenseItemProps };
};

export type ExpensesOverviewParamList = {
  RecentExpenses: undefined;
  AddExpenses: undefined;
  Budget: undefined;
  AllExpenses: undefined;
};

const stack = createNativeStackNavigator<RootStackParamList>();
const bottomTab = createBottomTabNavigator<ExpensesOverviewParamList>();

function BottomTabsExpenses() {
  const rtl = isRTL();
  const renderActiveBottomTab = (
    SvgIcon: React.FC<{ color: string; width?: number; height?: number }>,
    focused: boolean
  ) => (
    <SvgIcon
      width={24}
      height={24}
      color={focused ? Colors.primaryColor : Colors.mainColor}
    />
  );

  const getBottomTabIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case "RecentExpenses":
        return renderActiveBottomTab(Trending, focused);
      case "AddExpenses":
        return renderActiveBottomTab(BadgePlus, focused);
      case "Budget":
        return renderActiveBottomTab(Banknote, focused);
      case "AllExpenses":
        return renderActiveBottomTab(Coins, focused);
      default:
        return null;
    }
  };

  return (
    <bottomTab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors.primaryColor,
        tabBarInactiveTintColor: Colors.mainColor,
        tabBarIcon: ({ focused }) => getBottomTabIcon(route.name, focused),
        tabBarLabel: ({ children, color }) => (
          <Text style={[styles.labelText, {
            fontFamily: rtl ? fontsAR.medium : fontsEN.medium,
            color,
          }]}>
            {i18n.t(`${children}`)}
          </Text>
        ),
        tabBarStyle: {
          height: 60,
          backgroundColor: Colors.bgScreen,
          paddingTop: 2,
        },
        headerShown: false,
      })}
    >
      <bottomTab.Screen name="RecentExpenses" component={RecentExpenses} />
      <bottomTab.Screen name="AddExpenses" component={ManageExpense} />
      <bottomTab.Screen name="Budget" component={Budget} />
      <bottomTab.Screen name="AllExpenses" component={AllExpenses} />
    </bottomTab.Navigator>
  );
}

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <stack.Navigator
        id={undefined}
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primaryColor },
          headerTintColor: Colors.white,
          headerShown: false,
        }}
      >
        <stack.Screen name="Splash" component={Splash} />
        <stack.Screen name="Login" component={Login} />
        <stack.Screen name="Signup" component={Signup} />
        <stack.Screen name="ExpensesOverview" component={BottomTabsExpenses} />
        <stack.Screen name="ManageExpense" component={ManageExpense} />
      </stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  labelText: {
    fontSize: 12,
    marginBottom: 2,
  },
});

export default AppNavigation;
