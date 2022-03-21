// TODO: Add SDKs for Firebase products that you want to use
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage";

// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// import { initializeApp } from "firebase/app"

// import {REACT_APP_KEY_FIREBASE} from '../.env';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: REACT_APP_KEY_FIREBASE,
  apiKey: "AIzaSyDAibk8a05vmgMrrznutGtiFBbXRNDtEP0",
  authDomain: "goit-react-native-app-56154.firebaseapp.com",
  projectId: "goit-react-native-app-56154",
  storageBucket: "goit-react-native-app-56154.appspot.com",
  messagingSenderId: "590369622474",
  appId: "1:590369622474:web:a209453f3edc971273a733"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ experimentalForceLongPolling: true }); //add this..РЕШЕНИЕ
// const firebaseApp = initializeApp(firebaseConfig);

const auth = firebase.auth();
// const auth = getAuth(firebaseApp);
const db = firebase.firestore();
// const db = getFirestore(firebaseApp);
const storage = firebase.storage();
// const storage = getStorage(firebaseApp);

export { auth, db, storage };