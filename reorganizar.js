import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';

// Carrega a chave da conta de serviço
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

// Inicializa o app admin do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://auto-astral-b5295-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.database();

async function deletarOrderHistory() {
  try {
    // A referência raiz das mesas, supondo que é /tables
    const tablesRef = db.ref('tables');

    const snapshot = await tablesRef.once('value');
    if (!snapshot.exists()) {
      console.log('Nenhuma mesa encontrada.');
      return;
    }

    const tables = snapshot.val();
    let totalMesas = 0;

    for (const mesaId in tables) {
      if (tables.hasOwnProperty(mesaId)) {
        const orderHistoryRef = db.ref(`tables/${mesaId}/orderHistory`);
        await orderHistoryRef.remove();
        totalMesas++;
        console.log(`Order history da mesa ${mesaId} removida.`);
      }
    }

    console.log(`Migração finalizada. Order history removida de ${totalMesas} mesas.`);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao deletar order history:', error);
    process.exit(1);
  }
}

deletarOrderHistory();
