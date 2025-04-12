import { ActivityIndicator, View, StyleSheet } from "react-native";

import { Colors } from "../../constants/Styles";

function LoadingOverlay() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.darkBg
  }
})

export default LoadingOverlay;