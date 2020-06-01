var express = require('express');
var router = express.Router();


var group = require('../../../controller/chat/group/group.controller');
router.post('/post_group', group.saveGroup);
 router.get('/get_group/:groupId', group.findOneGroup);
 router.get('/get_group', group.findAll);
 router.put('/update_group/:groupId', group.updateGroup);
 router.delete('/delete_group/:groupId', group.deleteGroup);

module.exports = router;