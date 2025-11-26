const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'main.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.all("PRAGMA table_info(users)", (err, info) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Schema for users:');
            console.log(JSON.stringify(info, null, 2));
        }
    });
});

setTimeout(() => {
    db.close();
}, 1000);
