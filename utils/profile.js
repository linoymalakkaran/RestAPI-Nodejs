const Promise = require("bluebird"),
    {
        executeQuery,
        executeSelectQuery
    } = require('./query-exec'),
    {
        addActor,
        searchActorRecord
    } = require('../utils/actor'),
    {
        addEvent,
        searchEventRecord
    } = require('../utils/events'),
    {
        addRepoMaster,
        getRepoMaster
    } = require('../utils/repos-master'),
    {
        addRepoDetails,
        getRepoDetailsRecord
    } = require('../utils/repos-details');

//async for each implimentation
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

//•	Return records filtered by the repository id and event type
async function repoDetailsByIdAndEventType(query) {
    /**
     * Id, Event type
     */
    let _sql = `SELECT rm.id,rm.public,rm.created_at,rm.event_type,
    rm.actor_ref_id,rd.event_ref_id,rd.id as 'rdid' FROM tbl_repo_master rm
    inner join tbl_repo_details rd
    on rm.id = rd.repo_master_ref_id
    where ${query}`;

    let repoMasterData = await executeSelectQuery(_sql);

    // matching criteria
    if (!repoMasterData[0]) {
        return "Item Not Found";
    }

    let reposMasterQuery = `id='${repoMasterData[0].id}'`;
    let reposMasterDetails = await getRepoMaster(reposMasterQuery);
    reposMasterDetails = reposMasterDetails[0];

    let actorsDetailsQuery = `id='${repoMasterData[0].actor_ref_id}'`;
    let actorsDetails = await searchActorRecord(actorsDetailsQuery);

    let reposDetailsResult = [];
    const startFetchRepoDetails = async () => {
        await asyncForEach(repoMasterData, async (itemData) => {

            let reposDetailsQuery = `id='${itemData.rdid}'`;
            let reposDetails = await getRepoDetailsRecord(reposDetailsQuery);
            reposDetails[0].events = [];
            reposDetailsResult.push(reposDetails[0]);
        });
    }

    const startFetchEventDetails = async () => {
        await asyncForEach(reposDetailsResult, async (itemData) => {

            let eventDetailsQuery = `id='${itemData.event_ref_id}'`;
            let eventDetails = await searchEventRecord(eventDetailsQuery);
            itemData.events.push(eventDetails[0]);
        });
    }

    await startFetchRepoDetails();
    await startFetchEventDetails();
    reposMasterDetails.actors = actorsDetails;
    reposMasterDetails.repos = reposDetailsResult;
    return reposMasterDetails;
}

//•	Return actor details and list of contributed repositories by actor login
async function actorDetailsByLoginId(loginId) {
    let _sql = `select rm.id as 'master_repo_id',a.id as 'actor_id' from tbl_actor a
    inner join tbl_repo_master rm
    on a.id = rm.actor_ref_id
    where a.login = '${loginId}'`;

    let actorLoginRepoData = await executeSelectQuery(_sql);

    // matching criteria
    if (!actorLoginRepoData[0]) {
        return "No such Actor exsist";
    }

    let reposMasterQuery = `id='${actorLoginRepoData[0].master_repo_id}'`;
    let reposMasterDetails = await getRepoMaster(reposMasterQuery);
    reposMasterDetails = reposMasterDetails[0];

    let actorsDetailsQuery = `id='${actorLoginRepoData[0].actor_id}'`;
    let actorsDetails = await searchActorRecord(actorsDetailsQuery);

    let reposDetailsQuery = `repo_master_ref_id='${actorLoginRepoData[0].master_repo_id}'`;
    let reposDetailsResult = await getRepoDetailsRecord(reposDetailsQuery);

    const startFetchEventDetails = async () => {
        await asyncForEach(reposDetailsResult, async (itemData) => {

            let eventDetailsQuery = `id='${itemData.event_ref_id}'`;
            let eventDetails = await searchEventRecord(eventDetailsQuery);
            itemData.events = [];
            itemData.events.push(eventDetails[0]);
        });
    }

    await startFetchEventDetails();
    actorsDetails[0].repos = reposDetailsResult;
    return actorsDetails;
}

//•	Find the repository with the highest number of events from an actor (by login). If multiple repos have the same number of events, return the one with the latest event.
async function repoByHighestNumberOfEventsByActor() {
    let _sql = `select count(*) as 'no_of_events',rm.actor_ref_id,rm.id from tbl_repo_master rm
    inner join tbl_repo_details rd
    on rm.id == rd.repo_master_ref_id
    inner join tbl_event e
    on e.id == rd.event_ref_id
    inner join tbl_actor a
    on a.id == rm.actor_ref_id
    group by rm.actor_ref_id;`;
    let repoDetails = await executeSelectQuery(_sql);

    var res = Math.max.apply(Math, repoDetails.map(function (o) { return o.no_of_events; }))
    var repoDetail = repoDetails.find(function (o) { return o.no_of_events == res; })

    let actorsDetailsQuery = `id='${repoDetail.actor_ref_id}'`;
    let actorsDetails = await searchActorRecord(actorsDetailsQuery);

    let reposMasterQuery = `id='${repoDetail.id}'`;
    let reposMasterDetails = await getRepoMaster(reposMasterQuery);
    reposMasterDetails = reposMasterDetails[0];

    let reposDetailsQuery = `repo_master_ref_id='${repoDetail.id}'`;
    let reposDetailsResult = await getRepoDetailsRecord(reposDetailsQuery);

    const startFetchEventDetails = async () => {
        await asyncForEach(reposDetailsResult, async (itemData) => {

            let eventDetailsQuery = `id='${itemData.event_ref_id}'`;
            let eventDetails = await searchEventRecord(eventDetailsQuery);
            itemData.events = [];
            itemData.events.push(eventDetails[0]);
        });
    }

    await startFetchEventDetails();

    return {
        total_number_of_events: repoDetail.no_of_events,
        actor: actorsDetails,
        repos: reposDetailsResult
    }
}

//•	Return list of all repositories with their top contributor (actor with most events).
async function reposWithAllTopContributers() {
    let _sql = `select count(*) as 'no_of_actors', actor_ref_id,id from tbl_repo_master
    group by actor_ref_id`;

    let contributorsList = await executeSelectQuery(_sql);

    let result = [];

    const startFetchRepoDetails = async () => {
        await asyncForEach(contributorsList, async (itemData) => {

            let actorsDetailsQuery = `id='${itemData.actor_ref_id}'`;
            let actorsDetails = await searchActorRecord(actorsDetailsQuery);

            let reposMasterQuery = `id='${itemData.id}'`;
            let reposMasterDetails = await getRepoMaster(reposMasterQuery);
            reposMasterDetails = reposMasterDetails[0];


            let repoDetailsWithActor = {
                no_of_actors: itemData.no_of_actors,
                actor: actorsDetails[0],
                repo: reposMasterDetails
            };
            result.push(repoDetailsWithActor);
        });
    }

    await startFetchRepoDetails();
    return result;
}

//•	Delete the history of actor’s events by login
async function deleteHistoryOfActorsEvent(login) {
    let actorsDetailsQuery = `login='${login}'`;
    let actorsDetails = await searchActorRecord(actorsDetailsQuery);

    if (!actorsDetails[0]) {
        return "Actor Not Found";
    }
    //removing actor from repository
    let _sql = `UPDATE tbl_repo_master 
    set actor_ref_id=0 
    where actor_ref_id=${actorsDetails[0].id}`;
    await executeQuery(_sql);
    return "Actor history has been deleted successfully.";
    // let _sql = `DELETE FROM tbl_actor 
    // where login="${login}"`;
    // return executeQuery(_sql);
}


module.exports = {
    repoDetailsByIdAndEventType,
    actorDetailsByLoginId,
    repoByHighestNumberOfEventsByActor,
    reposWithAllTopContributers,
    deleteHistoryOfActorsEvent
};