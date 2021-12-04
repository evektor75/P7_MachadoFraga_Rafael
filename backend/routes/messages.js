//imports
const express = require('express');
const router = express.Router();
const messagesCtrl = require('../controllers/messagesCtrl');

//router

router.post('/messages/new', messagesCtrl.createMessage);
router.get('/messages', messagesCtrl.listMessages);
router.delete('/messages/:messageId/delete', messagesCtrl.delete);

//Export
module.exports = router;