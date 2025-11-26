const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'main.db'));

const targetEmail = 'djleocv.hotmail.com@gmail.com';

db.serialize(() => {
    // 1. Tornar Admin
    db.run("UPDATE users SET isAdmin = 1 WHERE email = ?", [targetEmail], function (err) {
        if (err) console.error("Erro ao tornar admin:", err);
        else console.log(`Usuário ${targetEmail} promovido a ADMIN. (Linhas afetadas: ${this.changes})`);
    });

    // 2. Ativar Assinatura (por garantia)
    db.run("UPDATE users SET subscriptionStatus = 'active' WHERE email = ?", [targetEmail], function (err) {
        if (err) console.error("Erro ao ativar assinatura:", err);
        else console.log(`Assinatura de ${targetEmail} ativada. (Linhas afetadas: ${this.changes})`);
    });

    // 3. Verificar Status Final
    db.get("SELECT id, username, email, isAdmin, subscriptionStatus FROM users WHERE email = ?", [targetEmail], (err, row) => {
        if (err) console.error(err);
        else {
            console.log('\n--- STATUS ATUAL ---');
            console.log(row ? row : 'Usuário não encontrado!');
        }
    });
});

setTimeout(() => db.close(), 1000);
