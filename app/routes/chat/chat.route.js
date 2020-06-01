var express = require('express');
var router = express.Router();


var chat = require('../../../app/controller/chat/chat.controller');
router.post('/post_chat', chat.saveChat);
 router.get('/get_chat/:chatId', chat.findOneChat);
 router.get('/get_chat', chat.findAll);
 router.put('/update_chat/:chatId', chat.updateChat);
 router.delete('/delete_chat/:chatId', chat.deleteChat);


module.exports = router;