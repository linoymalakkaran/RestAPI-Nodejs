const Promise = require("bluebird"),
    {
        executeQuery,
        executeSelectQuery
    } = require('./query-exec');

async function addActor(actor) {
    /**
     * name, desc
     */
    let _sql = `INSERT INTO tbl_actor 
    (login, display_login, gravatar_id, url, avatar_url)
    VALUES("${actor.login}", "${actor.display_login}", "${actor.gravatar_id}", "${actor.url}", "${actor.avatar_url}")`;
    return executeQuery(_sql);
}

function updateActor(actor) {
    let _sql = `UPDATE tbl_actor 
    set display_login='${actor.display_login}',
    gravatar_id='${actor.gravatar_id}',
    url='${actor.url}',
    avatar_url='${actor.avatar_url}'
    where login='${actor.login}'`;
    return executeQuery(_sql);
}

function deleteActor(login) {
    let _sql = `DELETE FROM tbl_actor 
    where login="${login}"`;
    return executeQuery(_sql);
}

async function searchActorRecord(query) {
    let _sql = `SELECT * FROM tbl_actor where ${query}`;
    return executeSelectQuery(_sql);
    // return (
    //     new Promise((resolve, reject) => {
    //         let _sql = `SELECT * FROM tbl_actor where ${query}`;
    //         let data = executeSelectQuery(_sql);
    //         resolve(data);
    //     }));
}

module.exports = {
    addActor,
    updateActor,
    deleteActor,
    searchActorRecord
};