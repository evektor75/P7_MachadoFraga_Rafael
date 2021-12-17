//Imports
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const expressSession = require('express-session');
const cookieSession = require('cookie-session');


const userRoutes = require('./routes/user');
const messagesRoutes = require('./routes/messages');
const likesRoutes = require('./routes/likes');
const commentsRoutes = require('./routes/comments');


//instanciation serveur
const app = express();

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//Mise en place middleware express-session
/*app.set('trust proxy', 1);
app.use(expressSession({
    secret: 's3Cur3',
    name: 'sessionId'
}))
*/
//Mise en place du middleware cookie-session
let expiryDate = new Date( Date.now() + 60 * 60 * 1000); // 1 hour
app.use(cookieSession({
    name:'session',
    keys: ['key1', 'key2'],
    cookie: {
        secure:true, 
        httpOnly: true,
        domain:'http://localhost:3000',
        expires: expiryDate
    }    
}))
//Body Parser config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Helmet pour definir des en-têtes HTTP sécurisé
app.use(helmet());


//Routes
app.use('/api/auth', userRoutes);
app.use('/api', messagesRoutes);
app.use('/api', likesRoutes);
app.use('/api', commentsRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;