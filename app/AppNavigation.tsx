import React, { useEffect, useState } from "react";
import { AppState, Platform, Text } from "react-native";
import { reloadAppAsync } from "expo";
import { getLocales } from "expo-localization";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from "expo-splash-screen";
import { useUniwind } from "uniwind";

import { ExpenseItemProps } from "./components/ExpenseItem";
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
import { loadThemePreference } from "./utility/theme";
import { fonts } from "../src/theme/fonts";
import { useTheme } from "../src/theme/useTheme";

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
  const { getThemeColor } = useTheme();
  const activeColor = getThemeColor("primaryColor");
  const inactiveColor = getThemeColor("mainColor");

  const renderActiveBottomTab = (
    SvgIcon: React.FC<{ color: string; width?: number; height?: number }>,
    focused: boolean,
  ) => (
    <SvgIcon
      width={24}
      height={24}
      color={focused ? activeColor : inactiveColor}
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
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarIcon: ({ focused }) => getBottomTabIcon(route.name, focused),
        tabBarLabel: ({ children, color }) => (
          <Text className={`text-[12px] mb-0.5 ${fonts.medium}`} style={{ color }}>
            {i18n.t(`${children}`)}
          </Text>
        ),
        tabBarStyle: {
          height: 60,
          backgroundColor: getThemeColor("bgScreen"),
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
  const { getThemeColor } = useTheme();
  const { theme } = useUniwind();

  const baseNavigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      primary: getThemeColor("primaryColor"),
      background: getThemeColor("bgScreen"),
      card: getThemeColor("bgScreen"),
      text: getThemeColor("mainColor"),
      border: getThemeColor("borderColor"),
    },
  };

  // The language may have been changed from system settings, so keep the account in sync.
  const syncAccountLanguage = async () => {
    const language = getLanguagePreference();
    if (language !== (await getUserLanguage())) {
      await saveUserLanguage(language);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      await loadThemePreference();
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
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        id={undefined}
        initialRouteName={initialRoute as keyof RootStackParamList}
        screenOptions={{
          headerStyle: { backgroundColor: getThemeColor("primaryColor") },
          headerTintColor: getThemeColor("white"),
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

export default AppNavigation;
