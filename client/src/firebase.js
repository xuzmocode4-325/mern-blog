// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "wellness-hub-1bda4.firebaseapp.com",
  projectId: "wellness-hub-1bda4",
  storageBucket: "wellness-hub-1bda4.appspot.com",
  messagingSenderId: "137019492708",
  appId: "1:137019492708:web:4c8ce241a6a7420ca71271",
  measurementId: "G-WGZJ2TTTNH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);