import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "./constants/Styles";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import { AllExpenses } from "./screens/AllExpenses";
import { Splash } from "./screens/Splash";
import { RecentExpenses } from "./screens/RecentExpenses";
import { ManageExpense } from "./screens/ManageExpense";
import { ExpenseItemProps } from "./components/ExpenseItem";
import { FontLoader } from "./constants/FontLoader";
import i18n from "./assets/translation/config";
import { isRTL } from "./assets/translation/resources";
import { fontsAR, fontsEN } from "./constants/config";
import Budget from "./screens/Budget";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

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

function ExpensesOverview() {
  return (
    <bottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 55,
          backgroundColor: Colors.bgScreen,
        },
        tabBarActiveTintColor: Colors.darkBg,
        tabBarLabelStyle: {
          fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >
      <bottomTab.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title: i18n.t("recentExpenses"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" color={color} size={size} />
          ),
        }}
      />
      <bottomTab.Screen
        name="AddExpenses"
        component={ManageExpense}
        options={{
          title: i18n.t("addExpenses"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" color={color} size={size} />
          ),
        }}
      />
      <bottomTab.Screen
        name="Budget"
        component={Budget}
        options={{
          title: i18n.t("budget"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" color={color} size={size} />
          ),
        }}
      />
      <bottomTab.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: i18n.t("allExpenses"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" color={color} size={size} />
          ),
        }}
      />
    </bottomTab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontLoader>
        <StatusBar style="light" />
        <BottomSheetModalProvider>
          <NavigationContainer>
            <stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: Colors.primaryColor },
                headerTintColor: Colors.white,
                headerShown: false,
              }}
            >
              <stack.Screen name="Splash" component={Splash} />
              <stack.Screen name="Login" component={Login} />
              <stack.Screen name="Signup" component={Signup} />
              <stack.Screen name="ExpensesOverview" component={ExpensesOverview} />
              <stack.Screen name="ManageExpense" component={ManageExpense} />
            </stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </FontLoader>
    </GestureHandlerRootView>
  );
}
