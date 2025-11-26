const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'main.db'));

db.serialize(() => {
    // Adicionar coluna CPF se não existir
    db.run("ALTER TABLE users ADD COLUMN cpf TEXT", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('✅ Coluna CPF já existe.');
            } else {
                console.error('❌ Erro ao adicionar coluna CPF:', err.message);
            }
        } else {
            console.log('✅ Coluna CPF adicionada com sucesso!');
        }
    });
});

setTimeout(() => db.close(), 1000);
