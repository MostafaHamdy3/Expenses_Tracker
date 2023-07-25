import { Text, View, StyleSheet } from "react-native";

import { GlobalStyles } from "../../constants/Styles";

function ErrorOverlay({ message}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>An error occur!</Text>
      <Text style={styles.title}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700
  },
  text: {
    color: "white",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  }
})

export default ErrorOverlay;