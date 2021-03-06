//Imports
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/usersCtrl');
const auth = require('../utils/auth');
const rateLimit = require('../utils/rateLimit');

//Router
router.post('/signup', userCtrl.signup);
router.post('/login', rateLimit.limiter, userCtrl.login);
router.get('/compte', auth, userCtrl.getUserProfile);
router.get('/allProfiles', auth, userCtrl.getAllProfiles);
router.delete('/compte/delete/:id', auth, userCtrl.deleteUserProfile);


module.exports = router;