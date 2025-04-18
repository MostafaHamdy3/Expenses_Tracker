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
} from "react-native";

import { auth } from "../FirebaseConfig";
import { Colors } from "../constants/Styles";
import { RootStackParamList } from "../App";

import { createUserWithEmailAndPassword } from "firebase/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Indicator } from "../components/UI/Indicator";

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
        setIsSignupMessage("Email already Exist");
      else if (error.code === "auth/invalid-email")
        setIsSignupMessage("Invalid Email");
      else if (error.code === "auth/weak-password")
        setIsSignupMessage("Password should be at least 6 characters");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.subContent}>
          <Image
            source={require("../assets/icons/logo.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.subContent}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.titleSignup}>
            Please fill in the details to sign up.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="person"
              size={20}
              color={Colors.backgroundScreen}
              style={styles.icon}
            />
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>
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
              keyboardType="email-address"
              autoCapitalize="none"
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
          <View style={styles.loginContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleSignup}>
            {isLoading ? (
              <Indicator />
            ) : (
              <View style={styles.signupButton}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
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
  icon: ViewStyle;
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
    backgroundColor: Colors.darkerBg,
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
    color: Colors.white,
    fontSize: 26,
    fontWeight: "bold",
  },
  titleSignup: {
    color: Colors.white,
    fontSize: 12,
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
  loginContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  loginText: {
    color: Colors.white,
  },
  loginLink: {
    color: Colors.textColor1,
    fontWeight: "600",
  },
  signupButton: {
    alignItems: "center",
    backgroundColor: Colors.backgroundScreen,
    paddingVertical: 14,
    borderRadius: 12,
  },
  signupButtonText: {
    color: Colors.white,
    fontSize: 15,
  },
  errorMessageContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 8,
  },
  errorMessage: {
    color: Colors.error500,
  },
});
