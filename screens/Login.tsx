import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";

import { auth } from "../FirebaseConfig";
import { Colors } from "../constants/Styles";
import { RootStackParamList } from "../App";

import { signInWithEmailAndPassword } from "firebase/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Indicator } from "../components/UI/Indicator";

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
      <View style={styles.subContent}>
        <Image
          source={require("../assets/icons/logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.subContent}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.titleLogin}>Please login to continue.</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="mail"
            size={20}
            color={Colors.primaryColor}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
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
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
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
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={goToSignup}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.9}>
          {isLoading ? (
            <Indicator />
          ) : (
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </View>
          )}
        </TouchableOpacity>

        {isLoginFailed && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>
              Email or Password are invalid!
            </Text>
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
  icon: ViewStyle;
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
    fontWeight: "bold",
  },
  titleLogin: {
    color: Colors.mainColor,
    fontSize: 12,
    marginTop: 6,
  },
  inputContainer: {
    width: "86%",
    marginTop: 24,
    gap: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgContainer,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  registerContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  registerText: {
    color: Colors.mainColor,
  },
  registerLink: {
    color: Colors.primaryColor,
    fontWeight: "600",
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
  },
  errorMessageContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  errorMessage: {
    color: Colors.error500,
  },
});
