//imports
const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/commentsCtrl');

//router
router.post('/messages/:messageId/comment', commentsCtrl.comment);

//export
module.exports = router;