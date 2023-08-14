const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config;

const app = express();

const User = require('./models/users');
const Message = require('./models/messages');
const Group = require('./models/groups');
const GroupUser = require('./models/groupUsers');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');



app.use(bodyparser.json({ extended: false }));
app.use(cors({
    origin: "http://127.0.0.1:3000",
    // methods:["GET","POST"],
    // credentials: true,
}));

const sequelize = require('./util/database');

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);
Group.belongsToMany(User, { through: GroupUser});

GroupUser.belongsTo(Group);

Message.belongsTo(Group);
Group.hasMany(Message);

app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, `views/${req.url}`));
});

sequelize.sync().then((result) => {
    // sequelize.sync({force: true}).then((result) => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});

app.use((req, res, next) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});