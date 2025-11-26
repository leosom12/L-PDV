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
app.use(express.static('public'));

// ==================== DATABASE SETUP ====================
const MAIN_DB_PATH = path.join(__dirname, 'main.db');
const mainDb = new sqlite3.Database(MAIN_DB_PATH);

// Initialize Main DB
mainDb.serialize(() => {
    mainDb.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT UNIQUE,
        password TEXT,
        isAdmin INTEGER DEFAULT 0,
        subscriptionStatus TEXT DEFAULT 'pending', -- active, inactive, pending
        subscriptionExpiresAt TEXT,
        createdAt TEXT
    )`);

    // Create Admin if not exists
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = bcrypt.hashSync(adminPassword, 10);
    mainDb.run(`INSERT OR IGNORE INTO users (username, email, password, isAdmin, subscriptionStatus, createdAt) 
        VALUES ('Admin', ?, ?, 1, 'active', ?)`, [ADMIN_EMAIL, hash, new Date().toISOString()]);
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

        // Debtors Table (Clientes Devedores)
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
app.post('/api/register', (req, res) => {
    const { username, email, password, cnpj } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    mainDb.run(`INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, new Date().toISOString()],
        function (err) {
            if (err) return res.status(400).json({ error: 'Email já cadastrado' });

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

        // Check Subscription (skip for admin)
        if (!user.isAdmin && user.subscriptionStatus !== 'active') {
            // Allow login but frontend handles restriction? 
            // Or block? User said "Sim" enables access.
            // We'll send the status and let frontend handle the "Subscription Screen"
        }

        const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, SECRET_KEY);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin, subscriptionStatus: user.subscriptionStatus } });
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
    db.run(`INSERT INTO products (barcode, name, category, price, stock, icon) VALUES (?, ?, ?, ?, ?, ?)`,
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
        // Get items for each sale? For now just sales
        res.json(rows);
        db.close();
    });
});

app.post('/api/sales', authenticateToken, (req, res) => {
    const { items, paymentMethod, total } = req.body;
    const db = getUserDb(req.user.id);

    db.serialize(() => {
        // 1. Create Sale
        db.run(`INSERT INTO sales (total, paymentMethod, createdAt) VALUES (?, ?, ?)`,
            [total, paymentMethod, new Date().toISOString()],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                const saleId = this.lastID;

                // 2. Add Items and Update Stock
                const stmt = db.prepare(`INSERT INTO sale_items (saleId, productId, quantity, price) VALUES (?, ?, ?, ?)`);
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

// Debtors (New)
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
    db.run(`INSERT INTO debtors (name, email, cpf, phone, cardInfo, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, cpf, phone, cardInfo, new Date().toISOString()],
        function (err) {
            res.json({ id: this.lastID });
            db.close();
        }
    );
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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
