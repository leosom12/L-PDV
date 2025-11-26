const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_123';
const ADMIN_EMAIL = 'djleocv.hotmail.com@gmail.com';

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(express.static('public', {
    etag: false,
    maxAge: 0,
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }
}));

// ==================== DATABASE SETUP ====================
const MAIN_DB_PATH = path.join(__dirname, 'main.db');
const mainDb = new sqlite3.Database(MAIN_DB_PATH);

// Initialize Main DB
mainDb.serialize(() => {
    // Main Database (Users)
    mainDb.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT UNIQUE,
        password TEXT,
        cnpj TEXT,
        cpf TEXT,
        isAdmin INTEGER DEFAULT 0,
        subscriptionStatus TEXT DEFAULT 'pending',
        subscriptionExpiresAt TEXT,
        createdAt TEXT
    )`);

    // Create Admin if not exists
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = bcrypt.hashSync(adminPassword, 10);
    mainDb.run(`INSERT OR IGNORE INTO users (username, email, password, isAdmin, subscriptionStatus, createdAt) 
        VALUES ('Admin', ?, ?, 1, 'active', ?)`, [ADMIN_EMAIL, hash, new Date().toISOString()]);

    // Debtors Index (Global mapping email -> storeUserId)
    mainDb.run(`CREATE TABLE IF NOT EXISTS debtors_index (
        email TEXT PRIMARY KEY,
        storeUserId INTEGER,
        FOREIGN KEY(storeUserId) REFERENCES users(id)
    )`);
});

// Helper to get User DB
function getUserDb(userId) {
    const dbPath = path.join(__dirname, `user_${userId}.db`);
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            barcode TEXT,
            name TEXT,
            category TEXT,
            price REAL,
            stock INTEGER,
            icon TEXT
        )`);

        // Sales Table
        db.run(`CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total REAL,
            paymentMethod TEXT,
            createdAt TEXT
        )`);

        // Sale Items Table
        db.run(`CREATE TABLE IF NOT EXISTS sale_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            saleId INTEGER,
            productId INTEGER,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY(saleId) REFERENCES sales(id)
        )`);

        // Debtors Table
        db.run(`CREATE TABLE IF NOT EXISTS debtors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            cpf TEXT,
            phone TEXT,
            debtAmount REAL DEFAULT 0,
            cardInfo TEXT,
            createdAt TEXT
        )`);

        // Store Config
        db.run(`CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);

        // Boletos Table
        db.run(`CREATE TABLE IF NOT EXISTS boletos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            value REAL,
            dueDate TEXT,
            status TEXT DEFAULT 'pendente',
            createdAt TEXT
        )`);

        // Stock Movements Table
        db.run(`CREATE TABLE IF NOT EXISTS stock_movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            productId INTEGER,
            productName TEXT,
            type TEXT,
            quantity INTEGER,
            previousStock INTEGER,
            newStock INTEGER,
            reason TEXT,
            createdAt TEXT,
            FOREIGN KEY(productId) REFERENCES products(id)
        )`);
    });

    return db;
}

// ==================== MIDDLEWARE ====================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// ==================== AUTH ROUTES ====================
app.post('/api/register', async (req, res) => {
    const { username, email, password, cpf } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    mainDb.run(`INSERT INTO users (username, email, password, cpf, createdAt) VALUES (?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, cpf || '', createdAt],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email já cadastrado' });
                }
                return res.status(500).json({ error: 'Erro ao criar usuário' });
            }

            // Initialize user DB
            const userDb = getUserDb(this.lastID);
            userDb.close();

            res.json({ message: 'Usuário cadastrado com sucesso!' });
        }
    );
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    mainDb.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'Usuário não encontrado' });

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, SECRET_KEY);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin, subscriptionStatus: user.subscriptionStatus } });
    });
});

// Client Login (Only Email)
app.post('/api/client/login', (req, res) => {
    const { email } = req.body;

    mainDb.get(`SELECT storeUserId FROM debtors_index WHERE email = ?`, [email], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Cliente não encontrado' });

        const storeUserId = row.storeUserId;
        const userDb = getUserDb(storeUserId);

        userDb.get(`SELECT * FROM debtors WHERE email = ?`, [email], (err, debtor) => {
            if (err || !debtor) {
                userDb.close();
                return res.status(404).json({ error: 'Dados do cliente não encontrados' });
            }

            res.json({
                client: debtor,
                storeId: storeUserId
            });
            userDb.close();
        });
    });
});

// ==================== APP ROUTES ====================

// Dashboard
app.get('/api/dashboard', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);

    db.serialize(() => {
        db.get(`SELECT COUNT(*) as count FROM products`, (err, products) => {
            db.get(`SELECT COUNT(*) as count FROM products WHERE stock <= 5`, (err, lowStock) => {
                db.get(`SELECT COUNT(*) as count FROM products WHERE stock = 0`, (err, outStock) => {
                    db.get(`SELECT COUNT(*) as count, SUM(total) as total FROM sales`, (err, sales) => {
                        res.json({
                            totalProducts: products.count,
                            lowStockProducts: lowStock.count,
                            outOfStockProducts: outStock.count,
                            totalSales: sales.count,
                            totalSalesAmount: sales.total || 0
                        });
                        db.close();
                    });
                });
            });
        });
    });
});

// Products
app.get('/api/products', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.all(`SELECT * FROM products`, (err, rows) => {
        res.json(rows);
        db.close();
    });
});

app.post('/api/products', authenticateToken, (req, res) => {
    const { barcode, name, category, price, stock, icon } = req.body;
    const db = getUserDb(req.user.id);
    db.run(`INSERT INTO products(barcode, name, category, price, stock, icon) VALUES(?, ?, ?, ?, ?, ?)`,
        [barcode, name, category, price, stock, icon],
        function (err) {
            res.json({ id: this.lastID });
            db.close();
        }
    );
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
    const { barcode, name, category, price, stock, icon } = req.body;
    const db = getUserDb(req.user.id);
    db.run(`UPDATE products SET barcode=?, name=?, category=?, price=?, stock=?, icon=? WHERE id=?`,
        [barcode, name, category, price, stock, icon, req.params.id],
        function (err) {
            res.json({ message: 'Updated' });
            db.close();
        }
    );
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.run(`DELETE FROM products WHERE id=?`, [req.params.id], function (err) {
        res.json({ message: 'Deleted' });
        db.close();
    });
});

app.get('/api/products/barcode/:code', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.get(`SELECT * FROM products WHERE barcode = ?`, [req.params.code], (err, row) => {
        res.json(row || {});
        db.close();
    });
});

// Sales
app.get('/api/sales', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.all(`SELECT * FROM sales ORDER BY createdAt DESC`, (err, rows) => {
        res.json(rows);
        db.close();
    });
});

app.post('/api/sales', authenticateToken, (req, res) => {
    const { items, paymentMethod, total } = req.body;
    const db = getUserDb(req.user.id);

    db.serialize(() => {
        db.run(`INSERT INTO sales(total, paymentMethod, createdAt) VALUES(?, ?, ?)`,
            [total, paymentMethod, new Date().toISOString()],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                const saleId = this.lastID;

                const stmt = db.prepare(`INSERT INTO sale_items(saleId, productId, quantity, price) VALUES(?, ?, ?, ?)`);
                const updateStock = db.prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`);

                items.forEach(item => {
                    stmt.run(saleId, item.productId, item.quantity, item.price);
                    updateStock.run(item.quantity, item.productId);
                });

                stmt.finalize();
                updateStock.finalize();

                res.json({ id: saleId, total });
                db.close();
            }
        );
    });
});

// Debtors
app.get('/api/debtors', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.all(`SELECT * FROM debtors`, (err, rows) => {
        res.json(rows);
        db.close();
    });
});

app.post('/api/debtors', authenticateToken, (req, res) => {
    const { name, email, cpf, phone, cardInfo } = req.body;
    const db = getUserDb(req.user.id);

    db.serialize(() => {
        db.run(`INSERT INTO debtors(name, email, cpf, phone, cardInfo, createdAt) VALUES(?, ?, ?, ?, ?, ?)`,
            [name, email, cpf, phone, cardInfo, new Date().toISOString()],
            function (err) {
                if (err) {
                    db.close();
                    return res.status(500).json({ error: err.message });
                }

                const debtorId = this.lastID;

                mainDb.run(`INSERT OR REPLACE INTO debtors_index(email, storeUserId) VALUES(?, ?)`,
                    [email, req.user.id],
                    (err) => {
                        if (err) console.error('Error updating debtors index:', err);
                    }
                );

                res.json({ id: debtorId });
                db.close();
            }
        );
    });
});

// ==================== BOLETOS ROUTES ====================
app.get('/api/boletos', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.all(`SELECT * FROM boletos ORDER BY dueDate ASC`, (err, rows) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
        db.close();
    });
});

app.post('/api/boletos', authenticateToken, (req, res) => {
    const { description, value, dueDate, status } = req.body;
    const db = getUserDb(req.user.id);

    db.run(`INSERT INTO boletos(description, value, dueDate, status, createdAt) VALUES(?, ?, ?, ?, ?)`,
        [description, value, dueDate, status || 'pendente', new Date().toISOString()],
        function (err) {
            if (err) {
                db.close();
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID, message: 'Boleto criado com sucesso' });
            db.close();
        }
    );
});

app.get('/api/boletos/:id', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.get(`SELECT * FROM boletos WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }
        res.json(row || {});
        db.close();
    });
});

app.put('/api/boletos/:id', authenticateToken, (req, res) => {
    const { description, value, dueDate, status } = req.body;
    const db = getUserDb(req.user.id);

    if (status && !description && !value && !dueDate) {
        db.run(`UPDATE boletos SET status = ? WHERE id = ?`,
            [status, req.params.id],
            function (err) {
                if (err) {
                    db.close();
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Status atualizado com sucesso' });
                db.close();
            }
        );
    } else {
        db.run(`UPDATE boletos SET description = ?, value = ?, dueDate = ?, status = ? WHERE id = ?`,
            [description, value, dueDate, status, req.params.id],
            function (err) {
                if (err) {
                    db.close();
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Boleto atualizado com sucesso' });
                db.close();
            }
        );
    }
});

app.delete('/api/boletos/:id', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.run(`DELETE FROM boletos WHERE id = ?`, [req.params.id], function (err) {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Boleto excluído com sucesso' });
        db.close();
    });
});

// ==================== STOCK MOVEMENTS ROUTES ====================
// Listar movimentações de estoque
app.get('/api/stock-movements', authenticateToken, (req, res) => {
    const db = getUserDb(req.user.id);
    db.all(`SELECT * FROM stock_movements ORDER BY createdAt DESC LIMIT 100`, (err, rows) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
        db.close();
    });
});

// Criar nova movimentação de estoque
app.post('/api/stock-movements', authenticateToken, (req, res) => {
    const { productId, type, quantity, reason } = req.body;
    const db = getUserDb(req.user.id);

    // Buscar produto atual
    db.get(`SELECT * FROM products WHERE id = ?`, [productId], (err, product) => {
        if (err || !product) {
            db.close();
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const previousStock = product.stock;
        let newStock = previousStock;

        // Calcular novo estoque baseado no tipo
        if (type === 'entrada') {
            newStock = previousStock + quantity;
        } else if (type === 'saida') {
            newStock = previousStock - quantity;
            if (newStock < 0) {
                db.close();
                return res.status(400).json({ error: 'Estoque insuficiente' });
            }
        } else if (type === 'ajuste') {
            newStock = quantity; // Ajuste define o valor exato
        }

        // Atualizar estoque do produto
        db.run(`UPDATE products SET stock = ? WHERE id = ?`, [newStock, productId], (err) => {
            if (err) {
                db.close();
                return res.status(500).json({ error: err.message });
            }

            // Registrar movimentação
            db.run(`INSERT INTO stock_movements(productId, productName, type, quantity, previousStock, newStock, reason, createdAt) 
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
                [productId, product.name, type, quantity, previousStock, newStock, reason, new Date().toISOString()],
                function (err) {
                    if (err) {
                        db.close();
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({
                        id: this.lastID,
                        message: 'Movimentação registrada com sucesso',
                        newStock: newStock
                    });
                    db.close();
                }
            );
        });
    });
});

// ==================== SUBSCRIPTION ROUTES ====================
app.post('/api/subscription/notify', authenticateToken, (req, res) => {
    const userId = req.user.id;
    mainDb.run(`UPDATE users SET subscriptionStatus = 'verification' WHERE id = ?`, [userId], function (err) {
        if (err) return res.status(500).json({ error: 'Erro ao notificar pagamento' });
        res.json({ message: 'Notificação enviada' });
    });
});

// Admin Routes
app.get('/api/admin/users', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    mainDb.all(`SELECT id, username, email, isAdmin, subscriptionStatus, createdAt FROM users`, (err, rows) => {
        res.json(rows);
    });
});

app.put('/api/admin/users/:id/subscription', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    const { subscriptionStatus } = req.body;

    mainDb.run(`UPDATE users SET subscriptionStatus = ? WHERE id = ?`, [subscriptionStatus, req.params.id], function (err) {
        res.json({ message: 'Updated' });
    });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'online' });
});

// Start Server
app.listen(PORT, '0.0.0.0', async () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';

    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIP = iface.address;
                break;
            }
        }
        if (localIP !== 'localhost') break;
    }

    console.log('='.repeat(60));
    console.log('🛒 Sistema PDV Supermercado - PWA');
    console.log('='.repeat(60));
    console.log(`📡 Servidor LOCAL: http://localhost:${PORT}`);
    console.log(`🌐 Servidor REDE:  http://${localIP}:${PORT}`);
    console.log('');
    console.log('👤 ADMINISTRADOR:');
    console.log(`   📧 Email: ${ADMIN_EMAIL}`);
    console.log(`   🔑 Senha: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('');
    console.log('='.repeat(60));
    console.log('');

    // Iniciar ngrok automaticamente se configurado
    if (process.env.NGROK_AUTHTOKEN) {
        console.log('🌐 Iniciando túnel público ngrok...');
        try {
            const ngrok = require('@ngrok/ngrok');
            const listener = await ngrok.forward({
                addr: PORT,
                authtoken_from_env: true,
            });

            const publicUrl = listener.url();
            console.log('');
            console.log('✅ TÚNEL PÚBLICO ATIVO!');
            console.log(`🌐 URL PÚBLICA: ${publicUrl}`);
            console.log('');
            global.NGROK_URL = publicUrl;
        } catch (error) {
            console.log('⚠️ Ngrok não iniciado:', error.message);
        }
    }
});
