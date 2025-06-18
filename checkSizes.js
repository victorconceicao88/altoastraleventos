import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';

// Ajuste para o seu arquivo de credenciais
const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://auto-astral-b5295-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = getDatabase();

async function checkNode(path) {
  const ref = db.ref(path);
  const snapshot = await ref.once('value');
  if (!snapshot.exists()) {
    console.log(`No data at path ${path}`);
    return;
  }

  const val = snapshot.val();
  const numChildren = snapshot.numChildren();
  const sizeInBytes = Buffer.byteLength(JSON.stringify(val), 'utf8');

  console.log(`Path: ${path} — Children: ${numChildren} — Size aprox: ${sizeInBytes} bytes`);
}

async function main() {
  const rootRef = db.ref('/');
  const rootSnap = await rootRef.once('value');
  const keys = Object.keys(rootSnap.val() || {});

  for (const key of keys) {
    await checkNode('/' + key);
  }
}

main().catch(console.error);
