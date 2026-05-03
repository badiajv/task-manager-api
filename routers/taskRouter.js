const express = require('express');
const Task = require('../models/task');

const router = new express.Router()

router.post("/tasks", async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get("/tasks/:id", async (req, res) => {
    const id = req.params.id

    try {
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).send("Task not found")
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["title", "completed"]

    const isValidOperation = updates.every(field => allowedUpdates.includes(field))
    if (!isValidOperation) {
        return res.status(400).send("Invalid updates! You cannot update _id or __v")
    }

    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        )
        if (!task) {
            return res.status(404).send("Task not found")
        }
        res.send(task)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!Task){
            return res.status(404).send("Task not found")
        }
        res.send(task)
    } catch(error) {
        res.status(500).send(error.message)
    }
})

module.exports = router
