const Promise = require("bluebird"),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    {
        addActor,
        updateActor,
        deleteActor,
        searchRecord
    } = require('../utils/actor')
    ;

let upload = multer();

router.post('/add', upload.array(), (req, res) => {
    res.set('Content-Type', 'application/json');
    let actor = {
        login: req.body.login,
        display_login: req.body.display_login,
        gravatar_id: req.body.gravatar_id,
        url: req.body.url,
        avatar_url: req.body.avatar_url
    };

    addActor(actor)
        .then(() => {
            res.send({ status: "ok" });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});

router.post('/update', upload.array(), (req, res) => {
    res.set('Content-Type', 'application/json');
    let actor = {
        login: req.body.login,
        display_login: req.body.display_login,
        gravatar_id: req.body.gravatar_id,
        url: req.body.url,
        avatar_url: req.body.avatar_url
    };
    updateActor(actor)
        .then(() => {
            res.send({ status: "ok" });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});

router.post('/delete', upload.array(), (req, res) => {
    res.set('Content-Type', 'application/json');
    deleteActor(req.body.login)
        .then(() => {
            res.send({ status: "ok" });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});

router.get('/search', (req, res) => {
    res.set('Content-Type', 'application/json');
    let fieldname = req.query.fieldname;
    let fieldval = req.query.fieldval;
    let queryString = `${fieldname}='${fieldval}'`;
    searchActorRecord(queryString)
        .then((profile) => {
            res.send({ status: "ok", data: profile });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});


module.exports = router;