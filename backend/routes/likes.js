//imports
const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likesCtrl');

//router
router.post('/messages/like', likesCtrl.like);
router.delete('/messages/removelike/:id', likesCtrl.removeLike);

//export
module.exports = router;