import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";

import i18n from "../assets/translation/config";
import { isRTL } from "../assets/translation/resources";
import { Colors } from "../constants/Styles";
import { fontsAR, fontsEN, fontsNUM } from "../constants/config";
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
    <View style={styles.container}>
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{i18n.t("account")}</Text>
        <View style={styles.section}>
          {!!email && (
            <>
              <SettingsRow Icon={Mail} label={i18n.t("email")} value={email} />
              <View style={styles.separator} />
            </>
          )}
          <SettingsRow
            Icon={Banknote}
            label={i18n.t("monthlyBudget")}
            value={userBudget ? `$${userBudget}` : i18n.t("notSet")}
            valueStyle={userBudget ? styles.numberValue : undefined}
            onPress={budgetHandler}
          />
        </View>

        <Text style={styles.sectionTitle}>{i18n.t("preferences")}</Text>
        <View style={styles.section}>
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

        <Text style={styles.sectionTitle}>{i18n.t("about")}</Text>
        <View style={styles.section}>
          <SettingsRow
            Icon={Info}
            label={i18n.t("appVersion")}
            value={appConfig.expo.version}
            valueStyle={styles.numberValue}
          />
        </View>

        <View style={[styles.section, styles.logoutSection]}>
          <SettingsRow
            Icon={Logout}
            label={i18n.t("logout")}
            color={Colors.error500}
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  sectionTitle: TextStyle;
  section: ViewStyle;
  separator: ViewStyle;
  numberValue: TextStyle;
  logoutSection: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: Colors.bgScreen,
  },
  content: {
    width: "92%",
    alignSelf: "center",
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: Colors.placeholderColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    marginTop: 12,
    marginBottom: 6,
    marginHorizontal: 4,
  },
  section: {
    backgroundColor: Colors.bgContainer,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
    overflow: "hidden",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginHorizontal: 16,
  },
  numberValue: {
    fontFamily: fontsNUM.medium,
  },
  logoutSection: {
    marginTop: 24,
  },
});

export default Settings;
