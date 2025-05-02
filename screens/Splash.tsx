import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, ViewStyle, ImageStyle, TextStyle } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Colors } from "../constants/Styles";
import { Indicator } from "../components/UI/Indicator";
import { RootStackParamList } from "../App";

export const Splash = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

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
        <Indicator />
      </View>
      <View style={styles.copyrightView}>
        <Text style={styles.copyrightText}>
          copyright © 2025
        </Text>
      </View>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  logoImg: ImageStyle;
  indicator: ViewStyle;
  copyrightView: ViewStyle;
  copyrightText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bgScreen,
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
    color: Colors.mainColor,
    fontSize: 20,
    fontWeight: "500",
  },
});
