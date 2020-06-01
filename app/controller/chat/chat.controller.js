const express = require("express");
const under = require("underscore");
const router = express.Router();
const mongoose = require("mongoose");
const chatModel = require("../../../app/models/chat/chat.model");
const groupModel = require("../../../app/models/chat/group.model");

exports.saveChat = async (req, res) => {
    const chatQuery = {};
    chatQuery.GroupId = req.body.GroupId;
    chatQuery.To = req.body.To;
    chatQuery.From = req.body.From;
    chatQuery.Message = req.body.Message;
    chatQuery.Created_Date = new Date();
    chatQuery.Updated_Date = new Date();
   
     try {
      const result = await chatModel.create(chatQuery);
      res.send({ message: "chat Detail save successfully!" });
    } catch (error) {
      console.log("error", error);
      res.send(error);
    }
  };

// Find a single chat with a chatId
exports.findOneChat = (req, res) => {
    chatModel.find({_id:req.params.chatId, Is_deleted: false} ).then((chat) => {
      if (!chat ) {
        return res.status(404).send({
          message: "chat not found with id " + req.params.chatId,
        });
      }
      res.send(chat);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "chat not found with id " + req.params.chatId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving chat with id " + req.params.chatId,
      });
    });
  };

// Retrieve and return all chats from the database.
exports.findAll = (req, res) => {
    chatModel.find( { Is_deleted: false })
    .then(chats => {
        res.send(chats);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving chats."
        });
    });
  };
  
    // Update a grouchatp identified by the chatId in the request
  exports.updateChat = (req, res) => {
      // Validate Request
      if (!req.body.To) {
        return res.status(400).send({
          message: "chat content can not be empty",
        });
      }
    
      // Find chat and update it with the request body
      chatModel.findByIdAndUpdate(
        req.params.chatId,      
        {
            To : req.body.To,
            From : req.body.From,
            Message : req.body.Message,         
            Updated_Date :new Date()       
        },
        { new: true },
      )
        .then((chat) => {
          if (!chat) {
            return res.status(404).send({
              message: "chat not found with id " + req.params.chatId,
            });
          }
          res.send(chat);
        })
        .catch((err) => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "chat not found with id " + req.params.chatId,
            });
          }
          return res.status(500).send({
            message: "Error updating chat with id " + req.params.chatId,
          });
        });
    };
  
    //for delete chat
    exports.deleteChat = (req, res) => {
     
      chatModel.findByIdAndUpdate(req.params.chatId, { Is_deleted: true },  { new: true })
      .then((chat) => {
        if (!chat) {
          return res.status(404).send({
            message: "chat not found with id " + req.params.chatId,
          });
        }
        res.send({ message: "chat deleted successfully!" });
      })
      .catch((err) => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            message: "chat not found with id " + req.params.chatId,
          });
        }
        return res.status(500).send({
          message: "Could not delete chat with id " + req.params.chatId,
        });
      });
  };  