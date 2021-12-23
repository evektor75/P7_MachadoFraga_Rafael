//imports
const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likesCtrl');

//router
router.post('/messages/like', likesCtrl.like);

//export
module.exports = router;