import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { initializeApp } from "firebase/app"

import { REACT_APP_KEY_FIREBASE } from '../.env.skell.js';

const firebaseConfig = {
  apiKey: REACT_APP_KEY_FIREBASE,
  authDomain: "goit-react-native-app-56154.firebaseapp.com",
  projectId: "goit-react-native-app-56154",
  storageBucket: "goit-react-native-app-56154.appspot.com",
  messagingSenderId: "590369622474",
  appId: "1:590369622474:web:a209453f3edc971273a733"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
