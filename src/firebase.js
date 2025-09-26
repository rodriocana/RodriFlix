import { initializeApp } from "firebase/app";
   import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
   import { addDoc, getFirestore, collection } from "firebase/firestore";
   import { toast } from "react-toastify";

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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

   const logout = () => {
     signOut(auth);
   }

   export { auth, db, signup, login, logout };