import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";

import i18n from "../assets/translation/config";
import { fonts } from "../../src/theme/fonts";
import { RootStackParamList } from "../AppNavigation";
import { auth } from "../../FirebaseConfig";
import { useUserStore } from "../store/UserStore";
import { NavigationHeader } from "../components/common/NavigationHeader";
import { SettingsRow } from "../components/SettingsRow";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import LanguagePicker, {
  LanguagePickerHandle,
} from "../components/modals/LanguagePicker";
import {
  LanguagePreference,
  applyLanguagePreference,
  getLanguagePreference,
  languageNames,
} from "../utility/language";
import appConfig from "../../app.json";
import Mail from "../assets/svgs/mail.svg";
import Banknote from "../assets/svgs/banknote-arrow-down.svg";
import Languages from "../assets/svgs/languages.svg";
import Info from "../assets/svgs/info.svg";
import Logout from "../assets/svgs/log-out.svg";

const sectionTitle = `text-[14px] text-placeholderColor ${fonts.medium} mt-3 mb-1.5 mx-1`;
const section =
  "bg-bgContainer border border-borderColor rounded-xl overflow-hidden";

const Settings = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userBudget, getUserBudget, saveUserLanguage } = useUserStore();

  const [email, setEmail] = useState<string>(auth.currentUser?.email ?? "");
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguagePreference>(
    getLanguagePreference,
  );

  const languagePickerRef = useRef<LanguagePickerHandle>(null);

  useEffect(
    () => onAuthStateChanged(auth, (user) => setEmail(user?.email ?? "")),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      getUserBudget();
    }, []),
  );

  const changeLanguageHandler = async (selected: LanguagePreference) => {
    if (selected === language) return;
    setLanguage(selected);
    await saveUserLanguage(selected);
    await applyLanguagePreference(selected);
  };

  const budgetHandler = () => {
    navigation.navigate("ExpensesOverview", { screen: "Budget" });
  };

  const logoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userId");
      setShowLogoutModal(false);
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View className="flex-1 bg-bgScreen">
      <NavigationHeader title={i18n.t("Settings")} />
      <ConfirmModal
        showModal={showLogoutModal}
        closeModal={() => setShowLogoutModal(false)}
        confirm={logoutHandler}
        isLoading={false}
        title={i18n.t("confirmLogout")}
      />
      <LanguagePicker
        ref={languagePickerRef}
        selected={language}
        onSelect={changeLanguageHandler}
      />
      <ScrollView contentContainerClassName="px-[4%] py-4">
        <Text className={sectionTitle}>{i18n.t("account")}</Text>
        <View className={section}>
          {!!email && (
            <>
              <SettingsRow Icon={Mail} label={i18n.t("email")} value={email} />
              <View className="h-px bg-borderColor mx-4" />
            </>
          )}
          <SettingsRow
            Icon={Banknote}
            label={i18n.t("monthlyBudget")}
            value={userBudget ? `$${userBudget}` : i18n.t("notSet")}
            valueStyle={userBudget ? "font-num-medium" : undefined}
            onPress={budgetHandler}
          />
        </View>

        <Text className={sectionTitle}>{i18n.t("preferences")}</Text>
        <View className={section}>
          <SettingsRow
            Icon={Languages}
            label={i18n.t("language")}
            value={
              language === "system"
                ? i18n.t("deviceLanguage")
                : languageNames[language]
            }
            onPress={() => languagePickerRef.current?.present()}
          />
        </View>

        <Text className={sectionTitle}>{i18n.t("about")}</Text>
        <View className={section}>
          <SettingsRow
            Icon={Info}
            label={i18n.t("appVersion")}
            value={appConfig.expo.version}
            valueStyle="font-num-medium"
          />
        </View>

        <View className={`${section} mt-6`}>
          <SettingsRow
            Icon={Logout}
            label={i18n.t("logout")}
            destructive
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
