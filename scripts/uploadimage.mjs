import {  ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
import { storage,db} from "./firebaseConfig.mjs";
// import { collection, addDoc } from "firebase/firestore"
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
 
 
// Upload the file to Firebase Storage
 
async function uploadImageToFirebase(file) {
    if (!file) {
      console.error("❌ No file selected.");
      return;
    }
  
    try {
      // Show loading state (e.g., disable button, show spinner)
      console.log("🚀 Uploading file...");
      console.log("file name",file.name)
  
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}${file.name}`;
      const storagePath = `reportforHistory/${filename}`;
      const fileRef = storageRef(storage, storagePath);
      console.log("fileref",fileRef)
  
      // Upload the file
      const snapshot = await uploadBytes(fileRef, file);
      console.log("Uploaded a blob or file!");
      console.log("snapshot",snapshot)
  
      // Get download URL
      const imageUrl = await getDownloadURL(snapshot.ref);
      console.log("🔗 File available at:", imageUrl);
  
      // Save metadata to Firestore
      const metadata = {
        imageUrl: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      };
  
      // Add to Firestore
      await addDoc(collection(db, "reports"), metadata);
      console.log("🔥 Metadata saved to Firestore.");
  
      // Hide loading state
      console.log("✅ Upload completed successfully!");
      return imageUrl;
    } catch (error) {
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Server Response:", error.serverResponse);
        throw error;
    }
  }
export default uploadImageToFirebase