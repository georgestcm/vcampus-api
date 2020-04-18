const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const db = "mongodb+srv://georges:1234@cluster0-rm0vl.mongodb.net/users?retryWrites=true&w=majority"
mongoose.set('useFindAndModify', false);
const db = "mongodb+srv://georges:vcampus2020@cluster0-fuxau.mongodb.net/vcampus?retryWrites=true&w=majority"


mongoose.connect(db,{useNewUrlParser: true},(err)=>{
if(err){
  console.log('The error is'+err)
} else {
  console.log('the databasee is connected')
}
})


router.get('/',(req,res)=>{
  res.send('api ready vcampus')

})

router.get('/get_curriculum_list',(req,res)=>{
  console.log(req.query)
  User.findOne({_id:req.query._id},(err,data)=>{
    if(err){
      res.status(401).send(err)
    } else {
      res.status(200).send(data.school['curriculums'])
    }
  })
})

router.post('/post_curriculum_list',(req,res)=>{
  User.findOne({_id:req.body._id},(err,data)=>{
    if(err){
      console.log(err)
      res.status(401).send("DB error, please contact  admin")
    } else {
      if(data.school['curriculums'].includes(req.body.curriculum)){
        res.status(404).send("This school already has this curriculum")
      } else {
        User.update({_id:req.body._id},{ $push:{ "school.curriculums": req.body.curriculum}  },function(err,data){
          if(err){
            console.log(err)
          } else {
            res.status(200).send('Curriculum added')
          }
        })
      }
    }
  })
})

router.post('/register',(req,res)=>{
let userData = req.body;
User.find({
  email: userData.username
},function(err,result){
 if(err){
    console.log(err)
 } else if(under._.isEmpty(result)){
   User.find({
     username: userData.username
   },function(err,result2){
     if(err){
       console.log(err+"error")
     } else if (under._.isEmpty(result2)) {
       bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(userData.password, salt, function(err, hash) {
              userData.password = hash;
              let user = new User(userData)
              user.save((error,registerUser)=>{
                if(error){
                  console.log(error)
                } else {
                  let payload = {
                    subject: registerUser._id
                  }
                  let token = jwt.sign(payload,"secretKey")
                  res.status(200).send({token,registerUser})
                }
              })
            });
        })
     } else {
       res.status(401).send('Username is already in use')
     }
   })
 } else {
   res.status(401).send('Email is already in use')
   }
})
})


router.post('/register_school_login',(req,res)=>{
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

})



router.post('/login',(req,res)=>{
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
                if(user.roles[0]===3 && user.school.registration_valid===false){
                  res.status(401).send('You are not authorized to login as a school')
                } else {
                  let payload = {
                    subject: user._id
                  }
                  let token = jwt.sign(payload,"secretKey")
                  let role = userData.role_request
                  res.status(200).send({token,user,role})
                }
              } else {
                res.status(401).send('You are not authorized to login with the selected role')
              }


          }
               });

      }
    }

  })

})

router.post('/save_school_data',(req,res)=>{
 let schoolData = req.body;

 User.update({_id:schoolData.school_id},{
   $set:{
     school: {
       school_name:schoolData.school_name,
       principal_first_name:schoolData.principal_first_name,
       principal_last_name: schoolData.principal_last_name,
       description:schoolData.description,
       registration_valid: true
     }
   }

 },function(err,result){
   if(err){
     res.status(401).send(err)
   } else {
     bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(schoolData.password, salt, function(err, hash) {
            schoolData.password = hash;
            User.update({_id:schoolData.school_id},{
              $set:{
                password:hash
              }
            },function(err,result){
              if(err){
                console.log(err)
              } else {
                res.status(200).send(result)
              }
            })
          });

      })

   }

 })

})

router.post('/create_new_teacher',(req,res)=>{
  let dataTeacher = req.body;
  let currentSchoolId= req.query.school_id;
  User.findOne({username:dataTeacher.username},function(err,teacher){
    if(err){
      console.log(err)
    } else {
      if(teacher){
        res.status(404).send({msg:"Username already in use"})
      } else {
        bcrypt.genSalt(saltRounds, function(err, salt) {
             bcrypt.hash(dataTeacher.password, salt, function(err, hash) {
               dataTeacher.password = hash;
               let user = new User(dataTeacher)
               user.save((error,registerTeacher)=>{
                 if(err){
                   console.log(err)
                 } else {
                   User.update({_id:currentSchoolId},{
                     $push:{
                       "school.teacher": {
                           _id: registerTeacher._id
                       }
                     }
                   },function(err,data){
                     if(err){
                       console.log(err)
                     } else {
                       User.update({_id:registerTeacher._id},{
                         $push:{
                           "teacher.schools": {
                               _id: currentSchoolId
                           }
                         }
                       },function(err,data){
                         if(err)
                            console.log(err)
                            else
                            res.status(200).send({msg:'New teacher has been added'})
                       })
                     }
                   })
                 }
               })
             });
         })
      }
    }
  })
})


module.exports = router;
