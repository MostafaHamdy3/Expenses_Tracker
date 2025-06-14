// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAohNtnaJ2AvdAQEdZM52UiGyaDveyRDkA",
  authDomain: "expenses-tracker-6b4be.firebaseapp.com",
  databaseURL: "https://expenses-tracker-6b4be-default-rtdb.firebaseio.com",
  projectId: "expenses-tracker-6b4be",
  storageBucket: "expenses-tracker-6b4be.firebasestorage.app",
  messagingSenderId: "393397029189",
  appId: "1:393397029189:web:904e025d26fed73b11162c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
