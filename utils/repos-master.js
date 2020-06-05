const Promise = require("bluebird"),
    {
        executeQuery,
        executeSelectQuery
    } = require('./query-exec');

async function addRepoMaster(repoMaster) {
    /**
     * ipaddr, RepoMastername, os
     */
    let _sql = `INSERT INTO tbl_repo_master 
            (event_type, actor_ref_id, public, created_at)
            VALUES("${repoMaster.event_type}",
             "${repoMaster.actor_ref_id}",
             "${repoMaster.public}",
             "${repoMaster.created_at}")`;
    return executeQuery(_sql);
}


function getRepoMaster(query) {
    let _sql = `SELECT * FROM tbl_repo_master order by id`;
    if (query) {
        _sql = `SELECT * FROM tbl_repo_master where ${query} order by id`;
    }
    return executeSelectQuery(_sql);
}

module.exports = {
    addRepoMaster,
    getRepoMaster
};