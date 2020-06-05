const sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(process.env.db);

module.exports = db;