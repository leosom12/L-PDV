const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./main.db');

db.serialize(() => {
    db.get("SELECT * FROM users WHERE email='finaltest@example.com'", (err, user) => {
        if (err) console.error(err);
        if (!user) {
            console.log('User not found');
            return;
        }
        console.log('User:', user);

        db.all(`SELECT * FROM subscriptions WHERE user_id=${user.id}`, (err, subs) => {
            if (err) console.error(err);
            console.log('Subscriptions:', subs);
        });
    });
});
