const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const groupModel = require("../../../models/chat/group.model");
const groupMemberModel = require("../../../models/chat/groupmember.model");

exports.joinStudentToGroup = async (req, res) => {
  const groupQuery = {};
  groupQuery.AdminId = req.body.AdminId;
  groupQuery.Name = req.body.GroupName;//SchoolName_Group  
  groupQuery.Description = req.body.Description;
  groupQuery.Created_Date = new Date();
  groupQuery.SchoolId = req.body.SchoolId;
  groupQuery.GroupMember =[];
   try {
    groupModel.findOne({Name : req.body.GroupName})
      .then(group => {
        if(group){
        group.GroupMember.push(req.body.StudentId);
        group.save(); 
        res.send({ message: "Student added to existing group: "+req.body.GroupName });
        }else{
          groupQuery.GroupMember.push(req.body.StudentId);
          const result =  groupModel.create(groupQuery);
          res.send({ message: "group details saved successfully!" });
        }

      },err =>{
        res.send({message : "something went wrong!"});
      });
  } catch (error) {
    console.log("error", error);
    res.send(error);
  }
};

exports.saveGroup = async (req, res) => {
    const groupQuery = {};
    groupQuery.AdminId = req.body.AdminId;
    groupQuery.Name = req.body.Name;
    groupQuery.Description = req.body.Description;
    groupQuery.Created_Date = new Date();
    groupQuery.Updated_Date = new Date();
    groupQuery.SchoolId = req.body.SchoolId;
     try {
      
      const result = await groupModel.create(groupQuery);
      res.send({ message: "group Detail save successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send(error);
    }
  };

// Find a single group with a groupId
exports.findOneGroup = async (req, res) => {
    try {
        const result = await groupModel
          .find({ _id: req.params.groupId, })
          .populate({
            path: "GroupMember",
            model: "GroupMember",
            match: { Is_deleted: false },
                populate: {
                path: "GroupMemberId",
                model: "user",
                select: "username",             
            },
          });
         
        res.send(result);
      } catch (error) {
        console.log("error:", error);
        res.send({
          message: "Error retrieving group with id " + req.params.groupId,
          error,
        });
      }
  };

// Retrieve and return all groups from the database.
exports.findAll = (req, res) => {
    groupModel.find( { Is_deleted: false })
    .then(groups => {
        res.send(groups);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving groups."
        });
    });
  };

  // Retrieve and return all groups for school.
exports.getAllGroupBySchool = (req, res) => {
  console.log(req.params.schoolId);
  groupModel.find({SchoolId : req.params.schoolId })
  .then(groups => {
      res.send(groups);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving groups."
      });
  });
};
  
    // Update a group identified by the groupId in the request
  exports.updateGroup = (req, res) => {
      // Validate Request
      if (!req.body.Name) {
        return res.status(400).send({
          message: "group content can not be empty",
        });
      }
    
      // Find group and update it with the request body
      groupModel.findByIdAndUpdate(
        req.params.groupId,      
        {
          Name : req.body.Name,
          Description : req.body.Description,
          GroupMemberLimit : req.body.GroupMemberLimit,          
          Updated_Date :new Date()       
        },
        { new: true },
      )
        .then((group) => {
          if (!group) {
            return res.status(404).send({
              message: "group not found with id " + req.params.groupId,
            });
          }
          res.send(group);
        })
        .catch((err) => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "group not found with id " + req.params.groupId,
            });
          }
          return res.status(500).send({
            message: "Error updating group with id " + req.params.groupId,
          });
        });
    };
  
    //for delete group
    exports.deleteGroup = (req, res) => {    
      groupModel.findByIdAndUpdate(req.params.groupId, { Is_deleted: true,Deleted_Date:new Date(),Is_active:false },  { new: true })
      .then((group) => {
        if (!group) {
          return res.status(404).send({
            message: "group not found with id " + req.params.groupId,
          });
        }
        res.send({ message: "group deleted successfully!" });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "group not found with id " + req.params.groupId,
          });
        }
        return res.status(500).send({
          message: "Could not delete group with id " + req.params.groupId,
        });
      });
  };  