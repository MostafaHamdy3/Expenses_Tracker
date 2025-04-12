import { useCallback, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput";
import { fetchExpenses } from "../store/expense_store";
import { useFocusEffect } from "@react-navigation/native";
import Indicator from "../components/UI/Indicator";
import { Colors } from "../constants/Styles";
import { StyleSheet, View } from "react-native";

function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
      setIsLoading(false);
    }
    fetchData();
  }, []));

  return (
    <View style={styles.container}>
      {isLoading ? <Indicator /> : (
        <ExpensesOutput 
          expenses={expenses}
          expensesName="Total" 
          fallBackText="No registered expenses found!"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
});

export default AllExpenses;