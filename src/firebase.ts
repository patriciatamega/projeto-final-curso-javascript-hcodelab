// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAciC26TD6WcYKYC57H_NppqSTgsK8DZ3w",
  authDomain: "time-azul-hburger.firebaseapp.com",
  projectId: "time-azul-hburger",
  storageBucket: "time-azul-hburger.appspot.com",
  messagingSenderId: "488839518614",
  appId: "1:488839518614:web:9e9773131b7aaa8417e5b7",
  measurementId: "G-3FXVRQ24LB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);