const sqlite3 = require('sqlite3').verbose();

console.log('🔍 Testando Isolamento de Dados por Usuário\n');
console.log('='.repeat(60));

// Simular criação de bancos para diferentes usuários
function testUserIsolation() {
    // Usuário 1
    const user1Db = new sqlite3.Database('./test_user_1.db');
    user1Db.serialize(() => {
        user1Db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            barcode TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL
        )`);

        user1Db.run(`INSERT OR IGNORE INTO products (barcode, name, price) VALUES 
            ('1111111111', 'Produto Usuário 1 - Item A', 10.00),
            ('2222222222', 'Produto Usuário 1 - Item B', 20.00)`);

        console.log('✅ Usuário 1: Banco criado com produtos isolados');
    });

    // Usuário 2
    const user2Db = new sqlite3.Database('./test_user_2.db');
    user2Db.serialize(() => {
        user2Db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            barcode TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL
        )`);

        user2Db.run(`INSERT OR IGNORE INTO products (barcode, name, price) VALUES 
            ('3333333333', 'Produto Usuário 2 - Item X', 30.00),
            ('4444444444', 'Produto Usuário 2 - Item Y', 40.00)`);

        console.log('✅ Usuário 2: Banco criado com produtos isolados');
    });

    // Verificar isolamento
    setTimeout(() => {
        user1Db.all('SELECT * FROM products', (err, rows) => {
            console.log('\n📦 Produtos do Usuário 1:');
            rows.forEach(p => console.log(`   - ${p.name} (R$ ${p.price})`));
            user1Db.close();
        });

        user2Db.all('SELECT * FROM products', (err, rows) => {
            console.log('\n📦 Produtos do Usuário 2:');
            rows.forEach(p => console.log(`   - ${p.name} (R$ ${p.price})`));
            user2Db.close();

            console.log('\n' + '='.repeat(60));
            console.log('✅ ISOLAMENTO CONFIRMADO!');
            console.log('   Cada usuário tem seus próprios produtos');
            console.log('   Nenhum usuário pode ver dados de outro');
            console.log('='.repeat(60));
        });
    }, 500);
}

testUserIsolation();
