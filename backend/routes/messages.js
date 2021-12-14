//imports
const express = require('express');
const router = express.Router();
const messagesCtrl = require('../controllers/messagesCtrl');
const multer = require('../utils/multer-config');

//router

router.post('/messages/new', multer, messagesCtrl.createMessage);
router.get('/messages', messagesCtrl.listMessages);
router.delete('/messages/:id', messagesCtrl.delete);

//Export
module.exports = router;