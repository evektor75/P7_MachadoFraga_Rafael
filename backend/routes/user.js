const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/usersCtrl');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/me', userCtrl.getUserProfile);


module.exports = router;