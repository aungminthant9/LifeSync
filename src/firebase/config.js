import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAEliuS5VJr3dDbhcLsz8OZqR6yf5okncs",
    authDomain: "lifesync-cc645.firebaseapp.com",
    projectId: "lifesync-cc645",
    storageBucket: "lifesync-cc645.firebasestorage.com",
    messagingSenderId: "772509862327",
    appId: "1:772509862327:web:ff955af8d9f06bb87dc032"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);