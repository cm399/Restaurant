//packages imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

//routers imports
const restaurantsRouter = require('./routers/restaurant');
const reviewsRouter = require('./routers/review');
const replyRouter = require('./routers/reply');
const authRouter = require('./routers/auth');

//app defined
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const name = + new Date() + '-' + file.originalname;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//app uses
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', restaurantsRouter);
app.use('/', reviewsRouter);
app.use('/', replyRouter);
app.use('/', authRouter);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

//app listen & mongoDB connection
mongoose.connect('mongodb://localhost:27017/restro')
    .then(result => {
        app.listen(8080, ()=>{
            console.log('Server started at port 8080');
        });
    })
.catch(err => {
    console.log(err);
});