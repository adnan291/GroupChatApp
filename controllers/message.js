const Message = require('../models/messages');
const User = require('../models/users');
const {Op} = require('sequelize');

exports.postMessage = async (io, req, res, next) => {
    const message = req.body.message;
    const groupId = req.body.groupId;

    try {

       const response = await req.user.createMessage({
            message: message,
            groupId: groupId,
            userId: req.user.id,
        });
        // console.log("Response", req.user.name);
        const toServer = {
            message,
         user: {name: req.user.name}
        }
        io.emit('new-message', toServer);
        res.status(201).json({ message: response });

    }
     catch(err) {
        console.log(err);
    }
}

exports.getMessages = async (req, res, next) => {


    try {

   const lastMsgId = req.query.id || 0;
   const groupId = req.query.groupid;

   const messages = await  Message.findAll({
    where :{ id: { [Op.gt] : lastMsgId}, 
             groupId: groupId   },
    include: [{ model: User, attributes: ['name'] }],
   });

   res.json(messages)

    }
     catch(err) {
        console.log(err);
    }
}
