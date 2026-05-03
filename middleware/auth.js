const token = require('jsonwebtoken');
const User = require('../models/user');

let authenticate = async (req, res, next) => {
    try {
        let token = req.header("Authorization").replace("Bearer ", "")
        let decoded = token.verify(token, "superduper")
        let user = await User.findOne({_id: decoded._id, "tokens.token": token})

        if (!user) {
            throw new Error()
        } else {
            req.token = token
            req.user = user
            next()
        }
    } catch(error) {
        res.status(401).send({error: "Please authenticate the user"})
    }
}

module.exports = authenticate
