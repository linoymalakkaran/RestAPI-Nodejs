/**
 * Application interface
 * 1. Save (C)
 * 2. Search and View (R)
 * 3. Edit (U)
 * 4. Delete (D)
 * 5. Show  
 */

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });
const express = require('express'),
    app = express(),
    Promise = require("bluebird"),
    bodyParser = require('body-parser'),
    //config = require('config'),
    repos_master_router = require('./routes/repos-master-router'),
    repos_details_router = require('./routes/repos-details-router'),
    actor_router = require('./routes/actor-router'),
    event_router = require('./routes/events-router'),
    profile_router = require('./routes/profile-router'),
    file_router = require('./routes/file-router'),
    { init } = require('./utils/file-utils')
    ;


//dotenv.load({ path: '.env' });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(`${process.env.context}/api/repo_master`, repos_master_router);
app.use(`${process.env.context}/api/repo_details`, repos_details_router);
app.use(`${process.env.context}/api/actor`, actor_router);
app.use(`${process.env.context}/api/event`, event_router);
app.use(`${process.env.context}/api/profile`, profile_router);
app.use(`${process.env.context}/api/file`, file_router);

app.listen(process.env.PORT, () => {
    console.log(`App running => http://localhost:${process.env.PORT}${process.env.context}`);
});

// uncomment this section to load data to sqlite DB when application starts
// or use file API
// init()
//     .then(() => {
//         app.listen(process.env.PORT, () => {
//             console.log(`App running => http://localhost:${process.env.PORT}${process.env.context}`);
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//     })

