import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageStyle,
  TextStyle,
  StatusBar,
} from "react-native";

import { Colors } from "../constants/Styles";
import i18n from "../assets/translation/config";
import { isRTL } from "../assets/translation/resources";
import { fontsAR, fontsEN } from "../constants/config";
import { RootStackParamList } from "../AppNavigation";
import { auth } from "../../FirebaseConfig";
import { Indicator } from "../components/common/Indicator";

import { signInWithEmailAndPassword } from "firebase/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

interface LoginProps {
  navigation: LoginScreenNavigationProp;
}

export const Login = ({ navigation }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginFailed, setIsLoginFailed] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      AsyncStorage.setItem("authToken", token);
      AsyncStorage.setItem("userId", user.uid);
      navigation.replace("ExpensesOverview");
    } catch (error) {
      setIsLoginFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const goToSignup = (): void => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.subContent}>
        <Image
          source={require("../assets/icons/logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.subContent}>
        <Text style={styles.title}>{i18n.t("welcomeBack")}</Text>
        <Text style={styles.titleLogin}>{i18n.t("loginToContinue")}</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="mail"
            size={20}
            color={Colors.primaryColor}
          />
          <TextInput
            placeholder={i18n.t("email")}
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="lock"
            size={20}
            color={Colors.primaryColor}
          />
          <TextInput
            placeholder={i18n.t("password")}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            secureTextEntry={!isPasswordVisible}
            style={styles.textInput}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={20}
              color={Colors.primaryColor}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>{i18n.t("noAccount")}</Text>
          <TouchableOpacity onPress={goToSignup}>
            <Text style={styles.registerLink}>{i18n.t("signUp")}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.9}>
          {isLoading ? (
            <Indicator />
          ) : (
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>{i18n.t("login")}</Text>
            </View>
          )}
        </TouchableOpacity>

        {isLoginFailed && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>{i18n.t("invalidLogin")}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  subContent: ViewStyle;
  logo: ImageStyle;
  title: TextStyle;
  titleLogin: TextStyle;
  inputContainer: ViewStyle;
  inputWrapper: ViewStyle;
  textInput: TextStyle;
  registerContainer: ViewStyle;
  registerText: TextStyle;
  registerLink: TextStyle;
  loginButton: ViewStyle;
  loginButtonText: TextStyle;
  errorMessageContainer: ViewStyle;
  errorMessage: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.bgScreen,
  },
  subContent: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: "30%",
    marginBottom: 24,
  },
  title: {
    color: Colors.mainColor,
    fontSize: 26,
    fontFamily: isRTL() ? fontsAR.bold : fontsEN.bold,
  },
  titleLogin: {
    color: Colors.mainColor,
    fontSize: 12,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    marginTop: 6,
  },
  inputContainer: {
    width: "86%",
    marginTop: 24,
    gap: 12,
  },
  inputWrapper: {
    flexDirection: isRTL() ? 'row-reverse' : "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.bgContainer,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  textInput: {
    flex: 1,
    textAlign: isRTL() ? 'right' : 'left',
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  registerContainer: {
    flexDirection: isRTL() ? 'row-reverse' : "row",
    gap: 6,
    marginBottom: 12,
  },
  registerText: {
    color: Colors.mainColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  registerLink: {
    color: Colors.primaryColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  errorMessageContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  errorMessage: {
    color: Colors.error500,
    fontFamily: isRTL() ? fontsAR.regular : fontsEN.regular,
  },
});
