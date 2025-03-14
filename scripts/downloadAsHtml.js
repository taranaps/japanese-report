import {  ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
import { storage,db} from "./firebaseConfig.mjs";
// import { collection, addDoc } from "firebase/firestore"
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


import { checkAuth, logout } from "./auth.js";
import { db,storage } from "./firebaseConfig.mjs";
import { collection, getDocs, getFirestore, doc, getDoc, where, query,addDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import {  ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

import uploadImageToFirebase from '../scripts/uploadimage.mjs'