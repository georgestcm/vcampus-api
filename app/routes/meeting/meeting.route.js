var express = require('express');
var router = express.Router();


var meeting = require('../../controller/meeting/meeting.controller');

 router.post('/createMeeting', meeting.createMeeting);
 router.delete('/delete/:meetingId', meeting.deleteMeeting);
 router.get('/getMeetingsByCourse/:courseId', meeting.findAllByCourse);

 module.exports = router;