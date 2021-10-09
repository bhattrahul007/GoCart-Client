import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCiIVWOqLK22m_WKUHAKPkcIncrqNIvI_o",
    authDomain: "clone-e9171.firebaseapp.com",
    projectId: "clone-e9171",
    storageBucket: "clone-e9171.appspot.com",
    messagingSenderId: "138844337041",
    appId: "1:138844337041:web:1dccc4839eca68fa5b2030",
    measurementId: "G-XY8MNT6MW3"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth();

export {db, auth};