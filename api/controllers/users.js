const User = require("../models/user");
const TokenGenerator = require("../models/token_generator");

const UsersController = {
  Create: async (req, res) => {
    // const user = new User(req.body);
    const {email, password, username} = req.body
    try {
      const user = await User.signup(email, password, username)

      res.status(201).json({email, user})
    } catch (error) {
      res.status(400).json({error: error.message});

    }
  },

  Find: async (req, res) => {
    try {
      const user = await User.findOne({_id: req.get('User_ID')}, {password: 0})

      const token = await TokenGenerator.jsonwebtoken(req.get('User_ID'));
      // console.log(req.get('User_ID'))
      res.status(201).json({user: user, token: token})
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  },

  Update: async (req, res) => {
    try { 
      await User.updateOne({_id: req.params.id},
        { $set: { description: req.body.description }})
      const token = await TokenGenerator.jsonwebtoken(req.params.id);
      res.status(201).json({ message: "OK", token: token})
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = UsersController;
