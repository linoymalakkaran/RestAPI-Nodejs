const Promise = require("bluebird"),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    { init } = require('../utils/file-utils');

let upload = multer();

router.post('/loadlocaldb', async (req, res) => {
    res.set('Content-Type', 'application/json');
    let result = await init();
    res.send({ status: "ok", data: result });
});

module.exports = router;