
import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';



const firebaseConfig = {
  apiKey: "AIzaSyB_iZXO6XkCwtbIivkX8M4MPv0EYmGyFtY",
  authDomain: "rentora-dbfa3.firebaseapp.com",
  projectId: "rentora-dbfa3",
  storageBucket: "rentora-dbfa3.appspot.com",
  messagingSenderId: "883085066161",
  appId: "1:883085066161:web:56aa053af3995f2c080790",
};

const firebase = Firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();


export { firebase, db, storage };