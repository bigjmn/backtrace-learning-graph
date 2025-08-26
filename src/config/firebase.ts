// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyACOd6FBGWHboZlD_ACFiEp_Im8HwUpn7A",
    authDomain: "learning-backtrace.firebaseapp.com",
    projectId: "learning-backtrace",
    storageBucket: "learning-backtrace.firebasestorage.app",
    messagingSenderId: "86220603054",
    appId: "1:86220603054:web:90ba27520f12bfed50b73f",
    measurementId: "G-B7MJJJYJQC"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
