import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/Styles";
import Indicator from "../components/UI/Indicator";

const Splash = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const id = await AsyncStorage.getItem("userId");

        // if (token && id) await dispatch(getUserInfo(id));
        token ? navigation.replace("ExpensesOverview") : navigation.replace("Login");
      } catch (err) {
        console.log(err);
      }
    };

    setTimeout(() => checkLoginStatus(), 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/icons/logo.png")}
        style={styles.logoImg}
      />
      <View style={styles.indicator}>
        <Indicator/>
      </View>
      <View style={styles.copyrightView}>
        <Text style={styles.copyrightText}>
          copyright © 2025
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundScreen,
  },
  logoImg: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    position: "absolute",
    top: "20%",
  },
  indicator: {
    position: "absolute",
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  copyrightView: {
    marginTop: "90%",
  },
  copyrightText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "500",
  },
});

export default Splash;
