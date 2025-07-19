import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { db } from "../../FirebaseConfig";

interface userStore {
  userBudget: number;
  getUserBudget: () => Promise<void>;
  addOrUpdateUserBudget: (budget: number) => Promise<void>;
};

export const useUserStore = create<userStore>()(
  immer((set) => ({
    userBudget: 0,
    getUserBudget: async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const id = await AsyncStorage.getItem("userId");
        if (token) {
          const userQuery = doc(db, "user", id);
          const userDoc = await getDoc(userQuery);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({ userBudget: userData.budget });
          }
        }
      } catch (err) {
        console.log("getUserBudget ERROR ==>", err);
      }
    },
    addOrUpdateUserBudget: async (budget: number) => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const id = await AsyncStorage.getItem("userId");
        if (token) {
          const userDocRef = doc(db, "user", id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            await updateDoc(userDocRef, { budget });
          } else {
            await setDoc(userDocRef, { budget });
          }
          set({ userBudget: budget });
        }
      } catch (err) {
        console.log("addUserBudget ERROR ==>", err);
      }
    },
  }))
);