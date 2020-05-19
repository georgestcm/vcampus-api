const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('D:/VCampus-BackendApi/vcampus-api/app/models/user.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const schoolLogin = require('D:/VCampus-BackendApi/vcampus-api/app/models/user.js')



exports.schoolLogin = (req,res)=>{
        let userData = req.body;
        User.findOne({
          username: userData.username
        },function(error,user){
          if(error){
            console.log(error)
          } else {
            if(!user){
              res.status(401).send('username not found')
            } else {
              bcrypt.compare(userData.password, user.password).then(function(resp) {
                if(resp === false){
                  res.status(401).send('Invalid password')
                } else {
                    if((user.roles.indexOf(userData.role_request) > -1)){
                      if(user.roles[0]===3 && user.school.registration_valid===true){
                        res.status(401).send('You are not authorized to login here')
                      } else {
                        let payload = {
                          subject: user._id
                        }
                        let token = jwt.sign(payload,"secretKey")
                        let role = userData.role_request
                        res.status(200).send({status:false,_id:user._id})
                      }
                    } else {
                      res.status(401).send('You are not authorized to login with the selected role')
                    }     
                }
        });
      
            }
          }
      
        })
      
      };


