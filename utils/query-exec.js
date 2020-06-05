const Promise = require("bluebird"),
    db = require('../utils/sqlitedb')
    ;

async function executeQuery(query) {
    console.log(query);
    return (
        new Promise((resolve, reject) => {
            db.serialize(function () {
                db.run(query, [], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            });
        })
    );
}

async function executeSelectQuery(query) {
    console.log(query);
    return (
        new Promise((resolve, reject) => {
            db.serialize(function () {
                db.all(query, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        })
    );
}

module.exports = { executeQuery, executeSelectQuery };