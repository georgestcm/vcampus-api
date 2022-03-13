const meetingModel = require("../../models/meeting.model");

exports.createMeeting = async (req, res) => {
     try {
       await meetingModel.create(req.body);
      res.send({ message: "Meeting created successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send(error);
    }
  };

exports.findAllByCourse = (req, res) => {
  console.log(req.params.courseId);
  meetingModel.find( { deleted: false, course: req.params.courseId }).populate('course')
  .then(meeting => {
      res.send(meeting);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving meeting."
      });
  });
};

  //for delete meeting
  exports.deleteMeeting = (req, res) => {
   
    meetingModel.findByIdAndUpdate(req.params.meetingId, { deleted: true },  { new: true })
    .then((meeting) => {
      if (!meeting) {
        return res.status(404).send({
          message: "Meeting not found with id " + req.params.meetingId,
        });
      }
      res.send({ message: "meeting deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "meeting not found with id " + req.params.meetingId,
        });
      }
      return res.status(500).send({
        message: "Could not delete meeting with id " + req.params.meetingId,
      });
    });
};