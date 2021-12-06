//imports
const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likesCtrl');

//router
router.post('/messages/:messageId/vote/like', likesCtrl.like);
router.delete('/messages/:messageId/vote/removelike', likesCtrl.removeLike);
router.post('/messages/:messageId/vote/dislike', likesCtrl.dislike,);
router.delete('/messages/:messageId/vote/removedislike', likesCtrl.removeDislike);

//export
module.exports = router;