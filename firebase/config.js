// TODO: Add SDKs for Firebase products that you want to use
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage";

// import {REACT_APP_KEY_FIREBASE} from '../.env';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: REACT_APP_KEY_FIREBASE,
  apiKey: "AIzaSyBDGWPt6pB-xwja4Gvnj28dmP3EK5qncaw",
  authDomain: "goit-react-native-app-6825f.firebaseapp.com",
  projectId: "goit-react-native-app-6825f",
  storageBucket: "goit-react-native-app-6825f.appspot.com",
  messagingSenderId: "555308641992",
  appId: "1:555308641992:web:4ac35afeba24569e967ffd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { auth, firestore, storage };