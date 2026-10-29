import React, { useEffect, useState } from "react";
import { AppState, Platform, StyleSheet, Text } from "react-native";
import { reloadAppAsync } from "expo";
import { getLocales } from "expo-localization";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from "expo-splash-screen";

import { ExpenseItemProps } from "./components/ExpenseItem";
import { Colors } from "./constants/Styles";
import { isRTL } from "./assets/translation/resources";
import { fontsAR, fontsEN } from "./constants/config";
import { Expenses } from "./screens/Expenses";
import i18n from "./assets/translation/config";
import { ManageExpense } from "./screens/ManageExpense";
import Budget from "./screens/Budget";
import Settings from "./screens/Settings";
import { Login } from "./screens/Login";
import { Signup } from "./screens/Signup";
import BadgePlus from "./assets/svgs/badge-plus.svg";
import Banknote from "./assets/svgs/banknote-arrow-down.svg";
import Coins from "./assets/svgs/hand-coins.svg";
import SettingsIcon from "./assets/svgs/settings.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "./store/UserStore";
import { getLanguagePreference } from "./utility/language";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ExpensesOverview:
    | { screen: keyof ExpensesOverviewParamList; data?: ExpenseItemProps }
    | undefined;
  ManageExpense: { data: ExpenseItemProps };
};

export type ExpensesOverviewParamList = {
  Expenses: undefined;
  AddExpenses: undefined;
  Budget: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const bottomTab = createBottomTabNavigator<ExpensesOverviewParamList>();

void SplashScreen.preventAutoHideAsync();

function BottomTabsExpenses() {
  const rtl = isRTL();
  const renderActiveBottomTab = (
    SvgIcon: React.FC<{ color: string; width?: number; height?: number }>,
    focused: boolean,
  ) => (
    <SvgIcon
      width={24}
      height={24}
      color={focused ? Colors.primaryColor : Colors.mainColor}
    />
  );

  const getBottomTabIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case "Expenses":
        return renderActiveBottomTab(Coins, focused);
      case "AddExpenses":
        return renderActiveBottomTab(BadgePlus, focused);
      case "Budget":
        return renderActiveBottomTab(Banknote, focused);
      case "Settings":
        return renderActiveBottomTab(SettingsIcon, focused);
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
          <Text
            style={[
              styles.labelText,
              {
                fontFamily: rtl ? fontsAR.medium : fontsEN.medium,
                color,
              },
            ]}
          >
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
      <bottomTab.Screen name="Expenses" component={Expenses} />
      <bottomTab.Screen name="AddExpenses" component={ManageExpense} />
      <bottomTab.Screen name="Budget" component={Budget} />
      <bottomTab.Screen name="Settings" component={Settings} />
    </bottomTab.Navigator>
  );
}

const AppNavigation = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const { getUserLanguage, saveUserLanguage } = useUserStore();

  // The language may have been changed from system settings, so keep the account in sync.
  const syncAccountLanguage = async () => {
    const language = getLanguagePreference();
    if (language !== (await getUserLanguage())) {
      await saveUserLanguage(language);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      token ? setInitialRoute("ExpensesOverview") : setInitialRoute("Login");
      if (token) {
        syncAccountLanguage();
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const hideSplash = async () => {
      if (initialRoute) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [initialRoute]);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const nativeLanguage = () =>
      `${getLanguagePreference()}-${getLocales()[0]?.languageCode}`;
    const startupLanguage = nativeLanguage();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && nativeLanguage() !== startupLanguage) {
        reloadAppAsync();
      }
    });
    return () => subscription.remove();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName={initialRoute as keyof RootStackParamList}
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primaryColor },
          headerTintColor: Colors.white,
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ExpensesOverview" component={BottomTabsExpenses} />
        <Stack.Screen name="ManageExpense" component={ManageExpense} />
      </Stack.Navigator>
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
