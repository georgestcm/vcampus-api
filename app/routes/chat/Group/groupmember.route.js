var express = require('express');
var router = express.Router();


var groupMember = require('../../../controller/chat/groupmember/groupmember.controller');
router.post('/post_groupmember', groupMember.saveGroupMember);
 router.get('/get_groupmember/:groupmemberId', groupMember.findOneGroupMember);
 router.get('/get_groupmember', groupMember.findAll);
 router.put('/update_groupmember/:groupmemberId', groupMember.updateGroupMember);
 router.delete('/delete_groupmember/:groupmemberId', groupMember.deleteGroupMember);

module.exports = router;