import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../FirebaseConfig";
import { Colors } from "../constants/Styles";
import Indicator from "../components/UI/Indicator";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("mostafa44hamdy@gmail.com");
  const [password, setPassword] = useState("Expenses4$App");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = user.stsTokenManager.accessToken;
      AsyncStorage.setItem("authToken", token);
      AsyncStorage.setItem("userId", user.uid);
      navigation.replace("ExpensesOverview");
    } catch (error) {
      setIsLoginFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const goToSignup = () => {
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
            color={Colors.backgroundScreen}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="lock"
            size={20}
            color={Colors.backgroundScreen}
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            secureTextEntry={!isPasswordVisible}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={20}
              color={Colors.backgroundScreen}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={goToSignup}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.darkerBg,
  },
  subContent: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 75,
    marginTop: "35%",
    marginBottom: 24,
  },
  title: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: "bold",
  },
  titleLogin: {
    color: Colors.white,
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
    backgroundColor: Colors.fieldBg,
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
    color: Colors.white,
  },
  registerLink: {
    color: Colors.textColor1,
    fontWeight: "600",
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: Colors.backgroundScreen,
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

export default Login;
