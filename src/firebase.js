import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, setPersistence, browserLocalPersistence, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCX3kdISW1yVz-L5Ul2nUIWLBmOxIA-Ah4",
  authDomain: "autoastralmesas.firebaseapp.com",
  databaseURL: "https://autoastralmesas-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "autoastralmesas",
  storageBucket: "autoastralmesas.firebasestorage.app",
  messagingSenderId: "682428196172",
  appId: "1:682428196172:web:2600c9709bcf0fce111be9"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Configuração otimizada para mobile
setPersistence(auth, browserLocalPersistence)
  .then(() => signInAnonymously(auth))
  .catch((error) => {
    console.error("Erro na autenticação:", error);
  });

export { database, auth };