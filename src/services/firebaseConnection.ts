import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const getEnv = (value: string | undefined) => value ?? ''

const firebaseConfig: FirebaseOptions = {
  apiKey: getEnv(process.env.REACT_APP_FIREBASE_API_KEY),
  authDomain: getEnv(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
  projectId: getEnv(process.env.REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: getEnv(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getEnv(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
  appId: getEnv(process.env.REACT_APP_FIREBASE_APP_ID),
  measurementId: getEnv(process.env.REACT_APP_FIREBASE_MEASUREMENT_ID)
}

const app = initializeApp(firebaseConfig)
const database = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { database, auth, storage }
