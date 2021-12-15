//imports
const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likesCtrl');

//router
router.post('/messages/:messageId/vote/like', likesCtrl.like);
router.delete('/messages/:messageId/vote/removelike', likesCtrl.removeLike);

//export
module.exports = router;