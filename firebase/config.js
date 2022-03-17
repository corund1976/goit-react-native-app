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
  apiKey: "AIzaSyALK5pnvgyUktzLnKiDu7xR6WwB_NpLJBI",
  authDomain: "goit-react-native-app-6df6c.firebaseapp.com",
  projectId: "goit-react-native-app-6df6c",
  storageBucket: "goit-react-native-app-6df6c.appspot.com",
  messagingSenderId: "789162518947",
  appId: "1:789162518947:web:32eaaafcc80b2159ebd216"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const firebaseApp = initializeApp(firebaseConfig);

const auth = firebase.auth();
// const auth = getAuth(firebaseApp);
const firestore = firebase.firestore();
// const db = getFirestore(firebaseApp);
const storage = firebase.storage();
// const storage = getStorage(firebaseApp);

export { auth, firestore, storage };