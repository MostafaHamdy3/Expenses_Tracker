import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, Text, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../constants/config";
import { getUserInfo } from "../store/actions/Authentication";
import Indicator from "../components/custom/Indicator";

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isRememberMe = await AsyncStorage.getItem("isRemember");
        const token = await AsyncStorage.getItem("authToken");
        const role = await AsyncStorage.getItem("role");
        const id = await AsyncStorage.getItem("userID");

        if (token && id) await dispatch(getUserInfo(id));
        if (isRememberMe === "true" && token) {
          if (role === "ADMIN") navigation.replace("Manager");
          else navigation.replace("Task");
        } else navigation.replace("Foresight");
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
        <Indicator />
      </View>
      <View style={styles.copyrightView}>
        <Text style={styles.copyrightText}>
          {i18n.t("copyright")}
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
    backgroundColor: Colors.white,
  },
  logoImg: {
    width: 360,
    height: 80,
    position: "absolute",
    top: "30%",
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
    color: Colors.black,
    fontSize: 20,
    fontWeight: "500",
  },
});

export default Splash;
