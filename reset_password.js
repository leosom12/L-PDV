const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database(path.join(__dirname, 'main.db'));

const targetEmail = 'djleocv.hotmail.com@gmail.com';
const newPassword = 'admin123';

console.log(`--- RESET DE SENHA ---`);
console.log(`Usuário: ${targetEmail}`);

bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
        console.error("Erro crítico ao gerar hash:", err);
        return;
    }

    db.run("UPDATE users SET password = ? WHERE email = ?", [hash, targetEmail], function (err) {
        if (err) {
            console.error("Erro no banco de dados:", err);
        } else {
            if (this.changes > 0) {
                console.log(`✅ SUCESSO! Senha redefinida para: ${newPassword}`);
            } else {
                console.log(`❌ ERRO: Usuário não encontrado no banco de dados.`);
            }
        }
        // Fechar conexão
        db.close();
    });
});
