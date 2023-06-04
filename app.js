const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const express = require('express');
const morgan = require('morgan');

// required controller
const pollController = require('./controller/pollController');

const app = express();

app.set('view engine', 'ejs');

// middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', pollController.createPollGetController);
app.post('/create', pollController.createPollPostController);
app.get('/polls/:id', pollController.viewPollGetController);
app.post('/polls/:id', pollController.viewPollPostController);
app.get('/polls', pollController.getAllPolls);
// database connection
mongoose.connect(process.env.LocalDatabase).then(() => {
    console.log(`Database connected successfully`);
    })
    .catch((err) => {
        console.log(err);
    });
  



app.listen(4444, () => {
    console.log(`App is running on port 4444`);
});