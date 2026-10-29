import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";

import i18n from "../assets/translation/config";
import { RootStackParamList } from "../AppNavigation";
import { auth } from "../../FirebaseConfig";
import { Indicator } from "../components/common/Indicator";
import { useUserStore } from "../store/UserStore";
import {
  applyLanguagePreference,
  getLanguagePreference,
} from "../utility/language";
import { fonts } from "../../src/theme/fonts";
import { useTheme } from "../../src/theme/useTheme";
import Email from "../assets/svgs/mail.svg";
import Lock from "../assets/svgs/lock-keyhole.svg";
import Visible from "../assets/svgs/eye.svg";
import Invisible from "../assets/svgs/eye-off.svg";

import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const inputWrapper = "flex-row items-center gap-2.5 bg-bgContainer px-4 rounded-xl";
const textInput = `flex-1 text-left py-3 text-[16px] ${fonts.medium}`;

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginProps {
  navigation: LoginScreenNavigationProp;
}

export const Login = ({ navigation }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginFailed, setIsLoginFailed] = useState<boolean>(false);
  const { getUserLanguage, saveUserLanguage } = useUserStore();
  const { getThemeColor } = useTheme();

  const syncAccountLanguage = async () => {
    const accountLanguage = await getUserLanguage();
    if (accountLanguage) {
      await applyLanguagePreference(accountLanguage);
    } else {
      await saveUserLanguage(getLanguagePreference());
    }
  };

  const handleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userId", user.uid);
      await syncAccountLanguage();
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
    <View className="flex-1 items-center bg-bgScreen">
      <StatusBar barStyle="dark-content" />
      <View className="items-center">
        <Image
          source={require("../assets/icons/logo.png")}
          resizeMode="contain"
          className="w-35 h-35 mt-[30%] mb-6"
        />
      </View>
      <View className="items-center">
        <Text className={`text-mainColor text-[26px] ${fonts.bold}`}>{i18n.t("welcomeBack")}</Text>
        <Text className={`text-mainColor text-[12px] ${fonts.medium} mt-1.5`}>{i18n.t("loginToContinue")}</Text>
      </View>
      <View className="w-[86%] mt-6 gap-3">
        <View className={inputWrapper}>
          <Email width={20} height={20} color={getThemeColor("primaryColor")} />
          <TextInput
            placeholder={i18n.t("email")}
            placeholderTextColorClassName="accent-placeholderColor"
            value={email}
            onChangeText={setEmail}
            className={textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View className={inputWrapper}>
          <Lock width={20} height={20} color={getThemeColor("primaryColor")} />
          <TextInput
            placeholder={i18n.t("password")}
            placeholderTextColorClassName="accent-placeholderColor"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            secureTextEntry={!isPasswordVisible}
            className={textInput}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <Visible width={20} height={20} color={getThemeColor("primaryColor")} />
            ) : (
              <Invisible
                width={20}
                height={20}
                color={getThemeColor("placeholderColor")}
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-1.5 mb-3">
          <Text className={`text-mainColor ${fonts.medium}`}>{i18n.t("noAccount")}</Text>
          <TouchableOpacity onPress={goToSignup}>
            <Text className={`text-primaryColor ${fonts.medium}`}>{i18n.t("signUp")}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.9}>
          {isLoading ? (
            <Indicator />
          ) : (
            <View className="items-center bg-primaryColor py-3.5 rounded-xl mt-8">
              <Text className={`text-white text-[15px] ${fonts.medium}`}>{i18n.t("login")}</Text>
            </View>
          )}
        </TouchableOpacity>

        {isLoginFailed && (
          <View className="justify-center items-start">
            <Text className={`text-error500 ${fonts.regular}`}>{i18n.t("invalidLogin")}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
