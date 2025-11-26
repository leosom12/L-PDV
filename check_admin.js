const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./main.db');

db.get('SELECT * FROM users WHERE email = ?', ['djleocv.hotmail.com@gmail.com'], (err, user) => {
    if (err) {
        console.error('Erro:', err);
    } else if (user) {
        console.log('✅ Usuário Admin encontrado:');
        console.log('ID:', user.id);
        console.log('Username:', user.username);
        console.log('Email:', user.email);
        console.log('Is Admin:', user.is_admin);
        console.log('Created At:', user.created_at);
    } else {
        console.log('❌ Usuário admin não encontrado');
    }
    db.close();
});
