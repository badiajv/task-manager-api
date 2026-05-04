const express = require('express');
const path = require('path');
require('./db/mongoose');

require('dotenv').config();

const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.use(userRouter)
app.use(taskRouter)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(port, () => {
    console.log("Server is live on the port: " + port)
})
