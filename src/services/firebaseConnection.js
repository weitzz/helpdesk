import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC79kHeEU6SY7zc-qHAXQ2T9ZvE4zVbOFs",
  authDomain: "sistema-c4fa8.firebaseapp.com",
  projectId: "sistema-c4fa8",
  storageBucket: "sistema-c4fa8.appspot.com",
  messagingSenderId: "746920227997",
  appId: "1:746920227997:web:35f380deeb5ef59d955074",
  measurementId: "G-1Z985VPP1B"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);

}
export default firebase