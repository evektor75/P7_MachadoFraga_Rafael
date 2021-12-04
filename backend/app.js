//Imports
const express = require('express');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/user');
const messagesRoutes = require('./routes/messages');
const likesRoutes = require('./routes/likes');


//instanciation serveur
const app = express();

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Body Parser config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
app.use('/api/auth', userRoutes);
app.use('/api', messagesRoutes);
app.use('/api', likesRoutes);

module.exports = app;