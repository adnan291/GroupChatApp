const Message = require('../models/messages');
const User = require('../models/users');

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