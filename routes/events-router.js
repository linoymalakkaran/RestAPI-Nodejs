const Promise = require("bluebird"),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    {
        addEvent,
        updateEvent,
        deleteEvent,
        getEvent
    } = require('../utils/events');

let upload = multer();

router.post('/add', upload.array(), (req, res) => {
    res.set('Content-Type', 'application/json');
    let event = {
        name: req.body.name,
        description: req.body.description
    };

    addEvent(event)
        .then(() => {
            res.send({ status: "ok" });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});

router.post('/update', upload.array(), (req, res) => {
    res.set('Content-Type', 'application/json');
    let event = {
        name: req.body.name,
        description: req.body.description
    };
    updateEvent(event)
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
    searchEventRecord(queryString)
        .then((profile) => {
            res.send({ status: "ok", data: profile });
        })
        .catch((err) => {
            res.send({ status: 'error', err });
        });
});


module.exports = router;