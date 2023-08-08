const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config;

const app = express();

const userRoutes = require('./routes/user');

app.use(bodyparser.json({extended: false}));
app.use(cors());

const sequelize = require('./util/database');

const User = require('./models/users');

app.use('/user', userRoutes);

sequelize.sync().then((result) => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});

app.use((req, res, next) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});