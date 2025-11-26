const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'main.db');
const db = new sqlite3.Database(dbPath);

console.log('--- LISTA DE USUÁRIOS ---');
db.all("SELECT id, username, email, isAdmin, subscriptionStatus FROM users", (err, rows) => {
    if (err) {
        console.error("Erro:", err);
        return;
    }
    if (rows.length === 0) {
        console.log("Nenhum usuário encontrado.");
    } else {
        rows.forEach(row => {
            console.log(`ID: ${row.id} | Nome: ${row.username} | Email: ${row.email} | Admin: ${row.isAdmin} | Status: ${row.subscriptionStatus}`);
        });
    }
});
// Não fechar imediatamente para garantir que o callback rode
setTimeout(() => db.close(), 1000);
