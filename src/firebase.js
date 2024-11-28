// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Correct import for Firebase Authentication

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5qV0Plg4BrlDJgqN_hIh-dAWmnPw8zIU",
  authDomain: "assignment3-4eded.firebaseapp.com",
  projectId: "assignment3-4eded",
  storageBucket: "assignment3-4eded.firebasestorage.app",
  messagingSenderId: "345033750693",
  appId: "1:345033750693:web:2ceb695f33be6822f7f54c",
  measurementId: "G-81JK9GXH4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export { onAuthStateChanged };