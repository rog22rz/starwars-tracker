import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwqkcMFhogMX3Lqai0JlgvzJY0YAy3T1k",
  authDomain: "show-tracker-3cb3e.firebaseapp.com",
  projectId: "show-tracker-3cb3e",
  storageBucket: "show-tracker-3cb3e.appspot.com",
  messagingSenderId: "866294667957",
  appId: "1:866294667957:web:92d9db8181ccd243a0bcfc",
  measurementId: "G-LCCF535V44",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

