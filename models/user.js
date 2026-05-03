const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

require('dotenv').config();

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password cannot conatin "password"')

            }
            if (value.includes("1234567")) {
                throw new Error('Password cannot conatin "1234567"')

            }
        }
    },
    tokens: [
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

userSchema.methods.generateAuthToken = async function() {
    let user = this
    let token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET || "superduper")

    user.tokens = user.tokens.concat({token:token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    let user = await User.findOne({email})
    if (!user) {
        throw new Error("Unable to login")
    }

    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to Login!")
    }
    return user
}

userSchema.pre("save", async function () {
    let user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})

let User = mongoose.model("User", userSchema)
module.exports = User
