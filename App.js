import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RecentExpenses from './screens/RecentExpenses';
import AllExpenses from './screens/AllExpenses';
import ManageExpense from './screens/ManageExpense';
import { Colors } from './constants/Styles';
import IconButton from './components/UI/IconButton';
import Login from './screens/Login';
import Splash from './screens/Splash';
import Signup from './screens/Signup';

const stack = createNativeStackNavigator();
const bottomTab = createBottomTabNavigator();

function ExpensesOverview() {
  const navigation = useNavigation();

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
      headerStyle: { backgroundColor: Colors.backgroundScreen },
      headerTintColor: "white",
      tabBarStyle: { backgroundColor: Colors.backgroundScreen },
      tabBarActiveTintColor: Colors.fieldBg,
      headerRight: ({ tintColor }) => (
        <View style={{ flexDirection: "row", gap: -8 }}>
          <IconButton 
            icon="add" 
            size={24} 
            color={tintColor} 
            onPress={addExpenseHandler} 
          />
          <IconButton
            icon="log-out-outline" 
            size={24}
            color={tintColor}
            onPress={logoutHandler}
          />
        </View>
      )}}>
      <bottomTab.Screen 
        name="Recent Expenses" 
        component={RecentExpenses} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          )
        }}
      />
      <bottomTab.Screen 
        name="All Expenses" 
        component={AllExpenses} 
        options={{
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
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.backgroundScreen },
            headerTintColor: "white",
          }}
        >
          <stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <stack.Screen
            name="ExpensesOverview"
            component={ExpensesOverview}
            options={{ headerShown: false }}
          />
          <stack.Screen name="ManageExpense" component={ManageExpense} />
        </stack.Navigator>
      </NavigationContainer>
    </>
  );
}