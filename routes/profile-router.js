const Promise = require("bluebird"),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    {
        repoDetailsByIdAndEventType,
        actorDetailsByLoginId,
        repoByHighestNumberOfEventsByActor,
        reposWithAllTopContributers,
        deleteHistoryOfActorsEvent
    } = require('../utils/profile');

let upload = multer();

router.get('/repoDetailsByIdAndEventType', async (req, res) => {
    res.set('Content-Type', 'application/json');
    let id = req.query.id;
    let event_type = req.query.event_type;
    let queryString = `rm.id='${id}' and rm.event_type='${event_type}'`;
    let result = await repoDetailsByIdAndEventType(queryString)
    res.send({ status: "ok", data: result });
});

router.get('/actorDetailsByLoginId', async (req, res) => {
    res.set('Content-Type', 'application/json');
    let login = req.query.login;
    let result = await actorDetailsByLoginId(login);
    res.send({ status: "ok", data: result });
});

router.get('/repoByHighestNumberOfEventsByActor', async (req, res) => {
    res.set('Content-Type', 'application/json');
    let fieldname = req.query.fieldname;
    let fieldval = req.query.fieldval;
    let queryString = `${fieldname}='${fieldval}'`;
    repoByHighestNumberOfEventsByActor(queryString)
        .then((profile) => {
            res.send({ status: "ok", data: profile });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});

router.get('/reposWithAllTopContributers', async (req, res) => {
    res.set('Content-Type', 'application/json');
    reposWithAllTopContributers()
        .then((profile) => {
            res.send({ status: "ok", data: profile });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});

router.post('/deleteHistoryOfActorsEvent', async (req, res) => {
    res.set('Content-Type', 'application/json');
    let fieldval = req.query.login;
    deleteHistoryOfActorsEvent(fieldval)
        .then((profile) => {
            res.send({ status: "ok", data: profile });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});

module.exports = router;