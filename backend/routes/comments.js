//imports
const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/commentsCtrl');
const auth = require("../utils/auth");

//router
router.post('/messages/comment',auth, commentsCtrl.comment);
router.delete('/messages/comment/:id',auth, commentsCtrl.deleteComment);

//export
module.exports = router;