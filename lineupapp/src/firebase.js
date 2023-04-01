import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {privateThings} from "./privateThings.js"
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = privateThings

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Firebase storage reference
const storage = getStorage(app);
export  { storage, db };