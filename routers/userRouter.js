const express = require('express');
const User = require('../models/user');
const authenticate = require('../middleware/auth');

require('dotenv').config();

const router = new express.Router()

router.post("/users", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
		res.status(201).send({user, token})
    } catch(error) {
        if (error.code === 11000) {
            return res.status(400).send("Email already exists")
        }
        res.status(400).send(error.message)
    }
})

router.post("/users/login", async(req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(error){
        res.status(400).send(error)
    }
})

router.get("/users/me", authenticate, async(req, res) => {
    res.send(req.user)
})

router.post("/users/logout", authenticate, async(req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})
		await req.user.save()
		res.send()
	} catch(error) {
		res.status(500).send()
	}
})

router.post("/users/logoutAll", authenticate, async(req, res) => {
	try {
		req.user.tokens = []
		await req.user.save()
		res.send()
	} catch(error) {
		res.status(500).send()
	}
})

router.get("/users/:id", async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send("User not found")
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "email", "password"]

    const isValidOperation = updates.every(field => allowedUpdates.includes(field))
    if(!isValidOperation) {
        return res.status(400).send("Invalid updates! You cannot update _id or __v")
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()
        if (!user) {
            return res.status(404).send("User not found")
        }
        res.send(user)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send("User not found")
        }
        res.send(user)
    } catch(error) {
        res.status(500).send(error.message)
    }
})

module.exports = router
