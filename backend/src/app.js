const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();
var bodyParser = require("body-parser");

// routes
const userRoute = require('../routes/userRoute');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000','http://43.205.203.95'],
    credentials: true
}));

app.use(logger("dev")); // for logs 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit:'2mb' }));
app.use(express.json({limit:'2mb'}));


// app.use(bodyParser.json({ limit: "2000kb" }));
// app.use(bodyParser.urlencoded({ limit: "2000kb", extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        message: "server is up and running 🛠",
        serverTime: new Date(Date.now()).toLocaleString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: "numeric",
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    })
});

app.use("/data", userRoute);

app.get('*', (req, res) => {
    return res.status(404).json({ message: 'Conteng Not found, Check the URL properly !!!' });
})

app.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;