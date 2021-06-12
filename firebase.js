import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDDpzuhPF-9uk6KAiPGZ4OApXeIUOTtLoE",
    authDomain: "whatsapp-clone-6636d.firebaseapp.com",
    projectId: "whatsapp-clone-6636d",
    storageBucket: "whatsapp-clone-6636d.appspot.com",
    messagingSenderId: "752093806080",
    appId: "1:752093806080:web:40895bda0dbd74b34162e5",
    measurementId: "G-P26LH3LYKB"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app() ;

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db,auth,provider};