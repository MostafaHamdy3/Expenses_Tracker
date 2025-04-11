// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };