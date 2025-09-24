
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, getFirestore, collection } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyC8-h2N7t3pfaq2GpjIfVih6CYMKdODCKs",
  authDomain: "rodriflix-9cbbc.firebaseapp.com",
  projectId: "rodriflix-9cbbc",
  storageBucket: "rodriflix-9cbbc.firebasestorage.app",
  messagingSenderId: "833011548771",
  appId: "1:833011548771:web:a62874dd9e796289ecae56",
  measurementId: "G-D06DJCTFRP"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    console.error("Error signing up:", error);
   toast.error(error.code);
  }
}

const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user; // devolvemos el usuario
  } catch (error) {
    console.log("Error logging in:", error);
    toast.error(error.code);
    throw error;
  }
};
const logout = () =>{
  signOut(auth);
}


export {auth, db, signup, login, logout};