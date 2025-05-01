import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDPGwoIF7ReMQsjXGngZ86vuC1P2X0iV0E",
  authDomain: "auto-astral-b5295.firebaseapp.com",
  databaseURL: "https://auto-astral-b5295-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "auto-astral-b5295",
  storageBucket: "auto-astral-b5295.firebasestorage.app",
  messagingSenderId: "865984431676",
  appId: "1:865984431676:web:1202dc70df895259c46539"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };