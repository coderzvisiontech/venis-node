const mongoose = require('mongoose')
const express = require('express');
const logger = require('morgan');
require("dotenv").config()
const app = express();

const students = require('./src/router/studentRoute.js')

app.use(express.json()); app.use(logger('combined'));

mongoose.connect(process.env.db_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database Connected successfully"))
    .catch((err) => { console.log("Database couldn't be connected"); console.log(err) });

mongoose.Promise = global.Promise;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.allow_origin);
    res.setHeader('Access-Control-Allow-Methods', process.env.allow_methods);
    res.setHeader('Access-Control-Allow-Headers', process.env.allow_headers);
    res.setHeader('Access-Control-Allow-Credentials', process.env.allow_credentials);
    next();
});

app.use('/api/v1/students', students);

app.use(function (req, res, next) {
    console.log("Not matched endpoint")
    next()
    res.status(404).json({ Status: "Failure", message: "No such route exists", data: null })
});

let server = app.listen(process.env.PORT, function () {
    console.log('Listening on port --->  %d', server.address().port);
});