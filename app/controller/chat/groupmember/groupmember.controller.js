const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const groupMemberModel = require("../../../models/chat/groupmember.model");
const groupModel = require("../../../models/chat/group.model");
const chatModel = require("../../../models/chat/chat.model");

exports.saveGroupMember = async (req, res) => {
    const groupMmberQuery = {};
      try {
      await groupModel.update({ _id:req.body.GroupId },{ $push: { GroupMember:  req.body.GroupMemberId } }  );
      res.send({ message: "groupMember Detail save successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send(error);
    }
  };


exports.findOneGroupMember = async (req, res) => {
  try {
    const result = await groupModel
      .find({
        GroupMember: { $elemMatch: { $eq: req.params.groupmemberId } },
        Is_deleted: false,
      })
      .populate({
        path: "GroupMember",
        model: "user",
        select: "username",
      });
    const groupDeatils = result.map((m) => {
      if (req.params.groupmemberId == m.AdminId) {
        m["Is_admin"] = true;
      } else {
        m["Is_admin"] = false;
      }
      return m;
    });
    const chatDetails = await chatModel
      .find({ To: req.params.groupmemberId },{From:1})
       .populate({
        path: "From",
        model: "user",
        select: "username"
      });
    res.send({ groupDeatils, chatDetails });
  } catch (error) {
    console.log("err:", error);
    res.status(500).send({
      message: "Error retrieving group with id " + req.params.groupmemberId,
    });
  }
};
// Retrieve and return all groupmember from the database.
exports.findAll = (req, res) => {
    groupMemberModel.find( { Is_deleted: false })
    .then(groupmembers => {
        res.send(groupmembers);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving groupmember."
        });
    });
  };
  
    // Update a groupmember identified by the groupmemberId in the request
  exports.updateGroupMember = (req, res) => {
      // Validate Request
      if (!req.body.Name) {
        return res.status(400).send({
          message: "group content can not be empty",
        });
      }
    
      // Find groupmember and update it with the request body
      groupMemberModel.findByIdAndUpdate(
        req.params.groupmemberId,      
        {
            GroupId : req.body.GroupId,
            GroupMemberId : req.body.GroupMemberId,      
            Updated_Date :new Date()       
        },
        { new: true },
      )
        .then((group) => {
          if (!group) {
            return res.status(404).send({
              message: "group not found with id " + req.params.groupmemberId,
            });
          }
          res.send(group);
        })
        .catch((err) => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "group not found with id " + req.params.groupmemberId,
            });
          }
          return res.status(500).send({
            message: "Error updating group with id " + req.params.groupmemberId,
          });
        });
    };
  
    //for delete groupmember
    exports.deleteGroupMember = (req, res) => {    
      groupMemberModel.findByIdAndUpdate(req.params.groupmemberId, { Is_deleted: true , Is_active:false },{ new: true })
      .then((groupmember) => {
        if (!groupmember) {
          return res.status(404).send({
            message: "groupmember not found with id " + req.params.groupmemberId,
          });
        }
        res.send({ message: "groupmember deleted successfully!" });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "groupmember not found with id " + req.params.groupmemberId,
          });
        }
        return res.status(500).send({
          message: "Could not delete groupmember with id " + req.params.groupmemberId,
        });
      });
  };  