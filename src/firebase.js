import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, setPersistence, browserLocalPersistence, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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

// Define persistência para manter o login no navegador
setPersistence(auth, browserLocalPersistence);

// Função para login anônimo
const loginAnonimo = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Usuário anônimo logado:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login anônimo:", error);
    throw error;
  }
};

// Verifica o estado da autenticação e executa login anônimo se necessário
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário já logado:", user.uid);
  } else {
    console.log("Nenhum usuário logado, tentando login anônimo...");
    loginAnonimo();
  }
});

export { database, auth };
