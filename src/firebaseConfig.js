// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANm6bZ9Ajj75VnaTVll7NM1bkmcMzCIJg",
  authDomain: "task-project-11d3c.firebaseapp.com",
  databaseURL: "https://task-project-11d3c-default-rtdb.firebaseio.com",
  projectId: "task-project-11d3c",
  storageBucket: "task-project-11d3c.appspot.com",
  messagingSenderId: "757859121833",
  appId: "1:757859121833:web:b7dce604c4c7502fd487b8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
