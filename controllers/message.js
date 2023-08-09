const Message = require('../models/messages');
const User = require('../models/users');
const {Op} = require('sequelize');

exports.postMessage = async (req, res, next) => {
    const message = req.body.message;

    try {

       const response = await req.user.createMessage({
            message: message,
            userId: req.user.id
        })

        res.status(201).json({ message: response });

    }
     catch(err) {
        console.log(err);
    }
}

exports.getMessages = async (req, res, next) => {


    try {

   const lastMsgId = req.query.id || 0;

   const messages = await  Message.findAll({
    where :{ id: { [Op.gt] : lastMsgId} }
   });

   res.json(messages)

    }
     catch(err) {
        console.log(err);
    }
}