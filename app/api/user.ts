import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../../FirebaseConfig";
import { LanguagePreference, isLanguagePreference } from "../utility/language";

export const fetchUserBudget = async (): Promise<number> => {
  const id = await AsyncStorage.getItem("userId");
  if (!id) return 0;
  const userDoc = await getDoc(doc(db, "user", id));
  return userDoc.data()?.budget ?? 0;
};

export const saveUserBudget = async (budget: number) => {
  const id = await AsyncStorage.getItem("userId");
  if (!id) throw new Error("No user logged in");
  await setDoc(doc(db, "user", id), { budget }, { merge: true });
  return budget;
};

export const getUserLanguage = async (): Promise<LanguagePreference | null> => {
  try {
    const id = await AsyncStorage.getItem("userId");
    if (id) {
      const userDoc = await getDoc(doc(db, "user", id));
      const language = userDoc.data()?.language;
      return isLanguagePreference(language) ? language : null;
    }
  } catch (err) {
    console.log("getUserLanguage ERROR ==>", err);
  }
  return null;
};

export const saveUserLanguage = async (language: LanguagePreference) => {
  try {
    const id = await AsyncStorage.getItem("userId");
    if (id) {
      await setDoc(doc(db, "user", id), { language }, { merge: true });
    }
  } catch (err) {
    console.log("saveUserLanguage ERROR ==>", err);
  }
};

