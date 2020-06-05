const fs = require('fs-extra'),
    path = require('path'),
    Promise = require("bluebird"),
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

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

function createDataFile() {
    return (
        new Promise((resolve, reject) => {
            let file = path.resolve(process.env.data);
            fs.writeFile(file, '[]', (err) => {
                if (err) {
                    console.log('Error while creating file', err);
                    reject(err);
                } else {
                    console.log('File initialized properly');
                    resolve();
                }
            });
        })
    );
}

// async function saveDataToLocalDB(data) {
//     return (
//         new Promise((resolve, reject) => {
//             let parsedata = JSON.parse(data);
//             let actor = parsedata.actors;
//             let repos = parsedata.repos;
//             let events = parsedata.events;

//             let actorId = await addActor(actor);

//             let repoMaster = {
//                 event_type: parsedata.event_type,
//                 actor_ref_id: actorId,
//                 public: parsedata.public,
//                 created_at: parsedata.created_at
//             };
//             let repoMasterId = await addRepoMaster(repoMaster);

//             const startFetchEventDetails = async () => {
//                 await asyncForEach(repos, async (itemData) => {

//                     let eventId = await addEvent(itemData.event[0]);
//                     let repoDetails = {
//                         created_date: itemData.created_date,
//                         repo_master_ref_id: repoMasterId,
//                         event_ref_id: eventId,
//                         name: itemData.name,
//                         url: itemData.url
//                     };
//                     let repoDetailsId = await addRepoDetails(repoDetails);
//                 });
//             }

//             await startFetchEventDetails();
//             resolve();
//         })
//     );
// }

// async function init() {
//     return (
//         new Promise((resolve, reject) => {
//             let file = path.resolve(process.env.data);
//             fs.readFile(file, (err, data) => {
//                 if (err) {
//                     console.log(err);
//                     reject(err);
//                 } else if (data.toString()) {
//                     saveDataToLocalDB()
//                         .then(resolve)
//                         .catch(reject);
//                 } else {
//                     resolve();
//                 }
//             });
//         })
//     );
// }

async function saveDataToLocalDB(data) {

    let parsedata = JSON.parse(data)[0];
    let actor = parsedata.actors[0];
    let repos = parsedata.repos;
    let events = parsedata.events;

    let actorId = await addActor(actor);

    let repoMaster = {
        event_type: parsedata.event_type,
        actor_ref_id: actorId,
        public: parsedata.public,
        created_at: parsedata.created_at
    };
    let repoMasterId = await addRepoMaster(repoMaster);

    const startFetchEventDetails = async () => {
        await asyncForEach(repos, async (itemData) => {

            let eventId = await addEvent(itemData.events[0]);
            let repoDetails = {
                created_date: itemData.created_date,
                repo_master_ref_id: repoMasterId,
                event_ref_id: eventId,
                name: itemData.name,
                url: itemData.url
            };
            let repoDetailsId = await addRepoDetails(repoDetails);
        });
    }

    await startFetchEventDetails();
    return `Load data to DB is successful with master Repository Id: ${repoMasterId}`;
}

async function init() {
    return (
        new Promise((resolve, reject) => {
            let file = path.resolve(process.env.data);
            fs.readFile(file, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if (data.toString()) {
                    saveDataToLocalDB(data.toString())
                        .then(resolve)
                        .catch(reject);
                } else {
                    resolve();
                }
            });
        })
    );
}

function getRecordByName(name) {
    return (
        new Promise((resolve, reject) => {
            let file = path.resolve(process.env.data);
            fs.readFile(file, (err, data) => {
                if (err) {
                    reject(err);
                }
                let records = JSON.parse(data.toString());
                let _records = records.filter((r) => {
                    return (r.name === name);
                });
                resolve(_records.pop());
            });
        })
    );
}

function getAllRecords() {
    return (
        new Promise((resolve, reject) => {
            let file = path.resolve(process.env.data);
            fs.readFile(file, (err, data) => {
                if (err) {
                    reject(err);
                }
                let records = JSON.parse(data.toString());
                resolve(records);
            });
        })
    );
}

function saveData(obj) {
    return (
        new Promise((resolve, reject) => {
            let data = JSON.stringify(obj);
            let file = path.resolve(process.env.data);
            fs.writeFile(file, data, (err) => {
                if (err) {
                    console.log('Error while saving data', err);
                    reject(err);
                } else {
                    console.log(`File saved successfully @ ${new Date()}`);
                    resolve();
                }
            });
        })
    );
}

module.exports = {
    init,
    getRecordByName,
    getAllRecords,
    saveData
}