const User = require("../models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;


exports.postUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  try {
    const response = await User.findAll({ where: { email: email } });
    // console.log(response);

    if (response.length === 0) {
    bcrypt.hash(password, saltRounds, async(err,hash) => {
      await User.create({
        name: name,
        email: email,
        phone:phone,
        password: hash,

      });
    });
     
      res.json({ alreadyexisting: false });
    }
    else {
      res.json({ alreadyexisting: true });
    }
  }  catch (error) {
    console.log(error);
  }
};