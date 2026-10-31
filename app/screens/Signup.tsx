import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import i18n from "../assets/translation/config";
import { RootStackParamList } from "../AppNavigation";
import { auth } from "../../FirebaseConfig";
import { Indicator } from "../components/common/Indicator";
import { fonts } from "../../src/theme/fonts";
import { useTheme } from "../../src/theme/useTheme";
import Person from '../assets/svgs/circle-user-round.svg';
import Mail from '../assets/svgs/mail.svg';
import Lock from '../assets/svgs/lock-keyhole.svg';
import Visible from '../assets/svgs/eye.svg';
import Invisible from '../assets/svgs/eye-off.svg';

const inputWrapper = "flex-row items-center gap-2.5 bg-bgContainer px-4 rounded-xl";
const textInput = `flex-1 text-left py-3 text-mainColor ${fonts.medium}`;

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
  const { getThemeColor } = useTheme();

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
    } catch (error: any) {
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
    <ScrollView contentContainerClassName="grow">
      <View className="flex-1 items-center bg-bgScreen">
        <View className="items-center">
          <Image
            source={require("../assets/icons/logo.png")}
            resizeMode="contain"
            className="w-35 h-35 mt-[30%] mb-6"
          />
        </View>
        <View className="items-center">
          <Text className={`text-mainColor text-[26px] ${fonts.bold}`}>{i18n.t("createAccount")}</Text>
          <Text className={`text-mainColor text-[12px] ${fonts.medium} mt-1.5`}>{i18n.t("fillDetails")}</Text>
        </View>
        <View className="w-[86%] mt-6 gap-3 mb-6">
          <View className={inputWrapper}>
            <Person width={20} height={20} color={getThemeColor("primaryColor")} />
            <TextInput
              placeholder={i18n.t("fullName")}
              value={name}
              onChangeText={setName}
              placeholderTextColorClassName="accent-placeholderColor"
              className={textInput}
            />
          </View>
          <View className={inputWrapper}>
            <Mail width={20} height={20} color={getThemeColor("primaryColor")} />
            <TextInput
              placeholder={i18n.t("email")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColorClassName="accent-placeholderColor"
              className={textInput}
            />
          </View>
          <View className={inputWrapper}>
            <Lock width={20} height={20} color={getThemeColor("primaryColor")} />
            <TextInput
              placeholder={i18n.t("password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              placeholderTextColorClassName="accent-placeholderColor"
              className={textInput}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              {isPasswordVisible ? (
                <Visible width={20} height={20} color={getThemeColor("primaryColor")} />
              ) : (
                <Invisible width={20} height={20} color={getThemeColor("placeholderColor")} />
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-1.5 mb-3">
            <Text className={`text-mainColor ${fonts.medium}`}>{i18n.t("haveAccount")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className={`text-primaryColor ${fonts.medium}`}>{i18n.t("login")}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleSignup}>
            {isLoading ? (
              <Indicator />
            ) : (
              <View className="items-center bg-primaryColor py-3.5 rounded-xl mt-8">
                <Text className={`text-white text-[15px] ${fonts.medium}`}>{i18n.t("signUp")}</Text>
              </View>
            )}
          </TouchableOpacity>
          {isSignupMessage && (
            <View className="justify-center items-start mt-2">
              <Text className={`text-error500 ${fonts.regular}`}>{isSignupMessage}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
