import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ViewStyle,
  ImageStyle,
  TextStyle,
  StatusBar,
} from "react-native";

import { auth } from "../FirebaseConfig";
import { Colors } from "../constants/Styles";
import { RootStackParamList } from "../App";

import { createUserWithEmailAndPassword } from "firebase/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Indicator } from "../components/UI/Indicator";
import i18n from "../assets/translation/config";
import { isRTL } from "../assets/translation/resources";
import { fontsAR, fontsEN } from "../constants/config";

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Signup">;

interface SignupProps {
  navigation: SignupScreenNavigationProp;
}

export const Signup = ({ navigation }: SignupProps) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignupMessage, setIsSignupMessage] = useState<string | null>(null);

  const handleSignup = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        navigation.replace("Login");
      }
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/email-already-in-use")
        setIsSignupMessage(i18n.t("emailAlreadyExist"));
      else if (error.code === "auth/invalid-email")
        setIsSignupMessage(i18n.t("invalidEmail"));
      else if (error.code === "auth/weak-password")
        setIsSignupMessage(i18n.t("passwordRules"));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.subContent}>
          <Image
            source={require("../assets/icons/logo.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.subContent}>
          <Text style={styles.title}>{i18n.t("createAccount")}</Text>
          <Text style={styles.titleSignup}>{i18n.t("fillDetails")}</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="person"
              size={20}
              color={Colors.primaryColor}
            />
            <TextInput
              placeholder={i18n.t("fullName")}
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>
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
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
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
              secureTextEntry={!isPasswordVisible}
              style={styles.textInput}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={20}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{i18n.t("haveAccount")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>{i18n.t("login")}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleSignup}>
            {isLoading ? (
              <Indicator />
            ) : (
              <View style={styles.signupButton}>
                <Text style={styles.signupButtonText}>{i18n.t("signUp")}</Text>
              </View>
            )}
          </TouchableOpacity>
          {isSignupMessage && (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessage}>{isSignupMessage}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

interface Styles {
  scrollContainer: ViewStyle;
  container: ViewStyle;
  subContent: ViewStyle;
  logo: ImageStyle;
  title: TextStyle;
  titleSignup: TextStyle;
  inputContainer: ViewStyle;
  inputWrapper: ViewStyle;
  textInput: TextStyle;
  loginContainer: ViewStyle;
  loginText: TextStyle;
  loginLink: TextStyle;
  signupButton: ViewStyle;
  signupButtonText: TextStyle;
  errorMessageContainer: ViewStyle;
  errorMessage: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  scrollContainer: {
    flexGrow: 1,
  },
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
  titleSignup: {
    color: Colors.mainColor,
    fontSize: 12,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    marginTop: 6,
  },
  inputContainer: {
    width: "86%",
    marginTop: 24,
    gap: 12,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
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
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  loginText: {
    color: Colors.mainColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  loginLink: {
    color: Colors.primaryColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  signupButton: {
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    paddingVertical: 14,
    borderRadius: 12,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  errorMessageContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 8,
  },
  errorMessage: {
    color: Colors.error500,
    fontFamily: isRTL() ? fontsAR.regular : fontsEN.regular,
  },
});
