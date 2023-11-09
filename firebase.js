import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyCE3cTRfCnVziv1W1hknx5tLwZRu14ieYI",
  authDomain: "instagram-clone-5df4f.firebaseapp.com",
  projectId: "instagram-clone-5df4f",
  storageBucket: "instagram-clone-5df4f.appspot.com",
  messagingSenderId: "42898788786",
  appId: "1:42898788786:web:7a6fb68e865f9fd642d4ab",
  measurementId: "G-1598YMDJ5H",
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { db, auth, storage, functions };
