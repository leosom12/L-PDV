const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'main.db'));

db.all("SELECT * FROM users", (err, rows) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(rows));
});
setTimeout(() => db.close(), 1000);
