import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from './constants/Styles';
import { Login } from './screens/Login';
import { Signup } from './screens/Signup';
import { IconButton } from './components/UI/IconButton';
import { AllExpenses } from './screens/AllExpenses';
import { Splash } from './screens/Splash';
import { RecentExpenses } from './screens/RecentExpenses';
import { ManageExpense } from './screens/ManageExpense';
import { ExpenseItemProps } from './components/ExpenseItem';
import { FontLoader } from './constants/FontLoader';
import i18n from './assets/translation/config';
import { isRTL } from './assets/translation/resources';
import { fontsAR, fontsEN } from './constants/config';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  ExpensesOverview: undefined;
  ManageExpense: { data: ExpenseItemProps };
};

export type ExpensesOverviewParamList = {
  RecentExpenses: undefined;
  AllExpenses: undefined;
};

const stack = createNativeStackNavigator<RootStackParamList>();
const bottomTab = createBottomTabNavigator<ExpensesOverviewParamList>();

function ExpensesOverview() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "ExpensesOverview">>();

  const addExpenseHandler = () => {
    navigation.navigate("ManageExpense");
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userId");
      navigation.replace("Login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <bottomTab.Navigator screenOptions={{
      headerStyle: {
        height: 90,
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
      },
      headerTintColor: Colors.white,
      tabBarStyle: {
        height: 55,
        backgroundColor: Colors.bgScreen,
      },
      tabBarActiveTintColor: Colors.darkBg,
      headerTitleStyle: {
        fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
        fontSize: 20,
        marginTop: -20,
      },
      tabBarLabelStyle: {
        fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
        fontSize: 12,
        marginBottom: 4,
      },
      headerRight: ({ tintColor }) => (
        <View style={{ flexDirection: "row", marginTop: -20 }}>
          <IconButton
            icon="add"
            size={24} 
            color={`${tintColor}`} 
            onPress={addExpenseHandler}
          />
          <IconButton
            icon="log-out-outline"
            size={24}
            color={`${tintColor}`}
            onPress={logoutHandler}
            style={{ marginRight: 12 }}
          />
        </View>
      )}}>
      <bottomTab.Screen 
        name="RecentExpenses"
        component={RecentExpenses} 
        options={{
          title: i18n.t("recentExpenses"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          )
        }}
      />
      <bottomTab.Screen 
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: i18n.t("allExpenses"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" color={color} size={size} />
          )
        }}
      />
    </bottomTab.Navigator>
  )
}

export default function App() {
  return (
    <FontLoader>
      <StatusBar style="light" />
      <NavigationContainer>
        <stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primaryColor },
            headerTintColor: Colors.white,
            headerShown: false
          }}
        >
          <stack.Screen name="Splash" component={Splash} />
          <stack.Screen name="Login" component={Login} />
          <stack.Screen name="Signup" component={Signup} />
          <stack.Screen name="ExpensesOverview" component={ExpensesOverview} />
          <stack.Screen name="ManageExpense" component={ManageExpense} />
        </stack.Navigator>
      </NavigationContainer>
    </FontLoader>
  );
}