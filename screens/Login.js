import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from "../firebase"

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from '../constants/Styles';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("ExpensesOverview");
      })
      .catch(() => { setErrorMessage(true) });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.titleLogin}>
        Please login to continue.
      </Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="mail"
            size={20}
            color={Colors.primary500}
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
            color={Colors.primary500}
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
              color={Colors.primary500}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.registerContainer}>
          <TouchableOpacity>
            <Text style={styles.registerText}>
              Don’t have an account? <Text style={styles.registerLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin}>
          <View style={styles.loginButton}>
            <Text style={styles.loginButtonText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>Email or Password are invalid!</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary800,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "10%",
  },
  title: {
    color: Colors.white,
    fontSize: 25,
    fontWeight: "600",
  },
  titleLogin: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 10,
  },
  inputContainer: {
    width: "86%",
    marginTop: 20,
    gap: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary50,
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
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  registerText: {
    color: Colors.white,
  },
  registerLink: {
    color: Colors.primary100,
    fontWeight: "600",
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: Colors.primary500,
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
