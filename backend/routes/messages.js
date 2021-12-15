//imports
const express = require('express');
const router = express.Router();
const messagesCtrl = require('../controllers/messagesCtrl');
const auth = require('../utils/auth');
const multer = require('../utils/multer-config');

//router

router.post('/messages/new', auth, multer, messagesCtrl.createMessage);
router.get('/messages', auth, messagesCtrl.listMessages);
router.delete('/messages/:id', auth, messagesCtrl.delete);

//Export
module.exports = router;