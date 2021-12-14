//Imports
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/usersCtrl');

//Router
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/compte', userCtrl.getUserProfile);
router.get('/allProfiles', userCtrl.getAllProfiles);
router.put('/compte/modify', userCtrl.updateAccount);
router.delete('/compte/delete', userCtrl.deleteUser);


module.exports = router;