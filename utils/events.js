const Promise = require("bluebird"),
    {
        executeQuery,
        executeSelectQuery
    } = require('./query-exec');

async function addEvent(event) {
    /**
     * name, desc
     */
    let _sql = `INSERT INTO tbl_event 
        (name, description)
        VALUES("${event.name}", "${event.description}")`;
    return executeQuery(_sql);
}

function updateEvent(event) {
    let _sql = `UPDATE tbl_event 
        set name='${event.name}',
        description='${event.description}',
        where id=${event.id}`;
    return executeQuery(_sql);
}

async function searchEventRecord(query) {
    let _sql = `SELECT * FROM tbl_event where ${query}`;
    return await executeSelectQuery(_sql);
}

module.exports = {
    addEvent,
    updateEvent,
    searchEventRecord
};