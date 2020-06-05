const Promise = require("bluebird"),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    {
        addRepoDetails,
        getRepoDetailsRecord
    } = require('../utils/repos-details');

let upload = multer();

router.post('/add', upload.array(), (req, res) => {
    res.set('Content-Type', 'application/json');
    let repo = {
        created_date: req.body.created_date,
        repo_master_ref_id: req.body.repo_master_ref_id,
        event_ref_id: req.body.event_ref_id,
        name: req.body.name,
        url: req.body.url
    };

    addRepoDetails(repo)
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
    getRepoDetailsRecord(queryString)
        .then((profile) => {
            res.send({ status: "ok", data: profile });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});


module.exports = router;