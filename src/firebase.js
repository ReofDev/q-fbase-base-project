// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAaCKSrvRD5s1yz7ByEzDwke5sw3tiBKA",
  authDomain: "tracker-5b82e.firebaseapp.com",
  projectId: "tracker-5b82e",
  storageBucket: "tracker-5b82e.appspot.com",
  messagingSenderId: "692853078184",
  appId: "1:692853078184:web:9e7b5d3998c2212b492a9d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
