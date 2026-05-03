const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('Connected to MongoDB Atlas')
    })
    .catch((error)=>{
        console.log('Connection error', error.message)
    })
