import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://auto-astral-b5295-default-rtdb.europe-west1.firebasedatabase.app'
});

const db = getDatabase();

async function clearPedidosOrganizados() {
  const ref = db.ref('pedidos_organizados');
  await ref.remove();
  console.log('Pedidos organizados apagados com sucesso.');
}

clearPedidosOrganizados().catch(console.error);
