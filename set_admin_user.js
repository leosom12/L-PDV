const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'main.db');
const db = new sqlite3.Database(dbPath);

const email = 'djleocv.hotmail.com@gmail.com';
const password = '199412';
const username = 'Admin Leo'; // Default username if creating new

const hashedPassword = bcrypt.hashSync(password, 10);

db.serialize(() => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err.message);
            return;
        }

        if (row) {
            // Update existing user
            db.run(
                `UPDATE users SET password = ?, isAdmin = 1, subscriptionStatus = 'active' WHERE email = ?`,
                [hashedPassword, email],
                function (err) {
                    if (err) {
                        console.error('Erro ao atualizar usuário:', err.message);
                    } else {
                        console.log(`✅ Usuário ${email} atualizado para ADMIN com a nova senha.`);
                    }
                }
            );
        } else {
            // Create new user
            db.run(
                `INSERT INTO users (username, email, password, isAdmin, subscriptionStatus) VALUES (?, ?, ?, 1, 'active')`,
                [username, email, hashedPassword],
                function (err) {
                    if (err) {
                        console.error('Erro ao criar usuário:', err.message);
                    } else {
                        console.log(`✅ Usuário ${email} criado como ADMIN com a senha fornecida.`);
                    }
                }
            );
        }
    });
});

db.close();
