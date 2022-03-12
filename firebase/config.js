// import firebase from "firebase";
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// import "firebase/auth";
// import "firebase/firestore";
// import "firebase/storage";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage";

// import {REACT_APP_KEY_FIREBASE} from '../.env';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: REACT_APP_KEY_FIREBASE,
  apiKey: "AIzaSyBfYM3ZQcGKrrrjUdpwvcUHT4u0GWh3SWQ",
  authDomain: "goit-react-native-app.firebaseapp.com",
  projectId: "goit-react-native-app",
  storageBucket: "goit-react-native-app.appspot.com",
  messagingSenderId: "180961808722",
  appId: "1:180961808722:web:5b131e13ce0a5328d7aa8b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, firestore, storage };