const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config;

const app = express();

const userRoutes = require('./routes/user');

app.use(bodyparser.json({extended: false}));
app.use(cors({
    origin: "http://127.0.0.1:3000",
    // methods:["GET","POST"],
    // credentials: true,
}));

const sequelize = require('./util/database');

const User = require('./models/users');

app.use('/user', userRoutes);

app.use('/', (req, res, next) => {
    // console.log(req.url);
    res.sendFile(path.join(__dirname, `views/${req.url}`));
});

sequelize.sync().then((result) => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});

app.use((req, res, next) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});