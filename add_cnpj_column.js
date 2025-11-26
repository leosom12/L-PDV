const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'main.db'));

db.serialize(() => {
    // Adicionar coluna CNPJ se não existir
    db.run("ALTER TABLE users ADD COLUMN cnpj TEXT", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('✅ Coluna CNPJ já existe.');
            } else {
                console.error('❌ Erro ao adicionar coluna CNPJ:', err.message);
            }
        } else {
            console.log('✅ Coluna CNPJ adicionada com sucesso!');
        }
    });
});

setTimeout(() => db.close(), 1000);
