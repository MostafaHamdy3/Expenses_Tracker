import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Colors } from "../../constants/Styles";

const Indicator = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  }
})

export default Indicator;