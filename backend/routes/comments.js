//imports
const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/commentsCtrl');

//router
router.post('/messages/:messageId/comment', commentsCtrl.comment);
router.delete('/messages/:messageId/comment/:id', commentsCtrl.deleteComment);

//export
module.exports = router;