const Promise = require("bluebird"),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    {
        addRepoMaster,
        getRepoMaster
    } = require('../utils/repos-master');

let upload = multer();

router.post('/add', upload.array(), (req, res) => {
    res.set('Content-Type', 'application/json');
    let repo = {
        event_type: req.body.event_type,
        actor_ref_id: req.body.actor_ref_id,
        public: req.body.public,
        created_at: req.body.created_at
    };

    addRepoMaster(repo)
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
    getRepoMaster(queryString)
        .then((profile) => {
            res.send({ status: "ok", data: profile });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});


module.exports = router;