const path = require('path');

const express = require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cors=require("cors");

const app = express();

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getSeconds() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null,true);
    } else {
        cb(null, false);
    }
}


app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data });
})

mongoose.connect(
    'mongodb://Olasammie:QpTemGQeOvjnALzm@cluster0-shard-00-00.cgxml.mongodb.net:27017,cluster0-shard-00-01.cgxml.mongodb.net:27017,cluster0-shard-00-02.cgxml.mongodb.net:27017/messages?ssl=true&replicaSet=atlas-1382lx-shard-0&authSource=admin&retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
  