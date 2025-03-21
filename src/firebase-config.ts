// firebase-config.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCowggL-BFQNZj5yeKZxZZWAzleysVKyyg",
  authDomain: "taskmanager-ebe3f.firebaseapp.com",
  projectId: "taskmanager-ebe3f",
  storageBucket: "taskmanager-ebe3f.firebasestorage.app",
  messagingSenderId: "941438452062",
  appId: "1:941438452062:web:11fa3f49c3cf28ea620fcf",
  measurementId: "G-8WJ9E2NZK3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth ,db};
