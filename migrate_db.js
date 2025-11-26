const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'main.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Add isAdmin column
    db.run("ALTER TABLE users ADD COLUMN isAdmin INTEGER DEFAULT 0", (err) => {
        if (err) console.log('Column isAdmin might already exist or error:', err.message);
        else console.log('Column isAdmin added.');
    });

    // Add subscriptionStatus column
    db.run("ALTER TABLE users ADD COLUMN subscriptionStatus TEXT DEFAULT 'pending'", (err) => {
        if (err) console.log('Column subscriptionStatus might already exist or error:', err.message);
        else console.log('Column subscriptionStatus added.');
    });

    // Add subscriptionExpiresAt column
    db.run("ALTER TABLE users ADD COLUMN subscriptionExpiresAt TEXT", (err) => {
        if (err) console.log('Column subscriptionExpiresAt might already exist or error:', err.message);
        else console.log('Column subscriptionExpiresAt added.');
    });

    // Add createdAt column
    db.run("ALTER TABLE users ADD COLUMN createdAt TEXT", (err) => {
        if (err) console.log('Column createdAt might already exist or error:', err.message);
        else console.log('Column createdAt added.');
    });

    // Create debtors_index if not exists
    db.run(`CREATE TABLE IF NOT EXISTS debtors_index (
        email TEXT PRIMARY KEY,
        storeUserId INTEGER,
        FOREIGN KEY(storeUserId) REFERENCES users(id)
    )`, (err) => {
        if (err) console.log('Error creating debtors_index:', err.message);
        else console.log('Table debtors_index checked/created.');
    });
});

db.close();
