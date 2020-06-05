const Promise = require("bluebird"),
    {
        executeQuery,
        executeSelectQuery
    } = require('./query-exec');

async function addRepoDetails(repoDetails) {
    /**
     * ipaddr, RepoDetailsname, os
     */
    let _sql = `INSERT INTO tbl_repo_details 
        (created_date, repo_master_ref_id, event_ref_id,name,url)
        VALUES("${repoDetails.created_date}",
        "${repoDetails.repo_master_ref_id}",
        "${repoDetails.event_ref_id}",
        "${repoDetails.name}",
        "${repoDetails.url}")`;
    return executeQuery(_sql);
}


async function getRepoDetailsRecord(query) {
    let _sql = `SELECT * FROM tbl_repo_details order by id`;
    if (query) {
        _sql = `SELECT * FROM tbl_repo_details where ${query} order by id`;
    }
    return await executeSelectQuery(_sql);
}

module.exports = {
    addRepoDetails,
    getRepoDetailsRecord
};