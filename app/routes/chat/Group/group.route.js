var express = require('express');
var router = express.Router();


var group = require('../../../controller/chat/group/group.controller');
router.post('/post_group', group.saveGroup);
router.post('/join_student_group', group.joinStudentToGroup);
 router.get('/get_group/:groupId', group.findOneGroup);
 router.get('/get_group', group.findAll);
 router.put('/update_group/:groupId', group.updateGroup);
 router.delete('/delete_group/:groupId', group.deleteGroup);
 router.get('/get_all_group_school/:schoolId', group.getAllGroupBySchool);
 router.post('/save_group_chat', group.saveGroupMessages);
 router.get('/get_group_chat/:groupId', group.getGroupMessagesByGroup);
module.exports = router;