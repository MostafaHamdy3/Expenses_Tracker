import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native';

import RecentExpenses from './screens/RecentExpenses';
import AllExpenses from './screens/AllExpenses';
import ManageExpense from './screens/ManageExpense';
import { Colors } from './constants/Styles';
import IconButton from './components/UI/IconButton';
import ExpenseContextProvider from './store/expenses-context';
import Login from './screens/Login';

const stack = createNativeStackNavigator();
const bottomTab = createBottomTabNavigator();

function ExpensesOverview() {
  const navigation = useNavigation();

  return (
    <bottomTab.Navigator screenOptions={{
      headerStyle: { backgroundColor: Colors.backgroundScreen },
      headerTintColor: "white",
      tabBarStyle: { backgroundColor: Colors.backgroundScreen },
      tabBarActiveTintColor: Colors.accent500,
      headerRight: ({ tintColor }) => 
        <IconButton 
          icon="add" 
          size={24} 
          color={tintColor} 
          onPress={() => {navigation.navigate("ManageExpense")}} 
        /> 
      }}>
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
      <ExpenseContextProvider>
        <NavigationContainer>
          <stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: Colors.backgroundScreen },
              headerTintColor: "white",
            }}
          >
            <stack.Screen
              name="login"
              component={Login}
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
      </ExpenseContextProvider>
    </>
  );
}
