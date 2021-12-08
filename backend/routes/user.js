//Imports
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/usersCtrl');

//Router
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/comptes', userCtrl.getUserProfile);
router.put('/compte/modify', userCtrl.updateAccount);
router.delete('/compte/delete', userCtrl.deleteUser);


module.exports = router;