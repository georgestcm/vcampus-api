const express = require('express')
const under = require("underscore")
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Message = require('../models/message')
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const db = "mongodb+srv://georges:1234@cluster0-rm0vl.mongodb.net/users?retryWrites=true&w=majority"
mongoose.set('useFindAndModify', false);
const db = "mongodb://localhost:27017/myproject"
// const db = "mongodb+srv://georges:vcampus2020@cluster0-fuxau.mongodb.net/vcampus?retryWrites=true&w=majority"


mongoose.connect(db, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('The error is' + err)
  } else {
    console.log('the databasee is connected')
  }
})


router.get('/', (req, res) => {
  res.send('api ready vcampus')

})

router.get('/get_curriculum_list', (req, res) => {
  console.log(req.query)
  User.findOne({ _id: req.query._id }, (err, data) => {
    if (err) {
      res.status(401).send(err)
    } else {
      res.status(200).send(data.school['curriculums'])
    }
  })
})

router.post('/post_curriculum_list', (req, res) => {
  User.findOne({ _id: req.body._id }, (err, data) => {
    if (err) {
      console.log(err)
      res.status(401).send("DB error, please contact  admin")
    } else {
      if (data.school['curriculums'].includes(req.body.curriculum)) {
        res.status(404).send("This school already has this curriculum")
      } else {
        User.update({ _id: req.body._id }, { $push: { "school.curriculums": req.body.curriculum } }, function (err, data) {
          if (err) {
            console.log(err)
          } else {
            res.status(200).send('Curriculum added')
          }
        })
      }
    }
  })
})

router.post('/register', (req, res) => {
  let userData = req.body;
  User.find({
    email: userData.username
  }, function (err, result) {
    if (err) {
      console.log(err)
    } else if (under._.isEmpty(result)) {
      User.find({
        username: userData.username
      }, function (err, result2) {
        if (err) {
          console.log(err + "error")
        } else if (under._.isEmpty(result2)) {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(userData.password, salt, function (err, hash) {
              userData.password = hash;
              let user = new User(userData)
              user.save((error, registerUser) => {
                if (error) {
                  console.log(error)
                } else {
                  let payload = {
                    subject: registerUser._id
                  }
                  let token = jwt.sign(payload, "secretKey")
                  res.status(200).send({ token, registerUser })
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


router.post('/register_school_login', (req, res) => {
  let userData = req.body;
  User.findOne({
    username: userData.username
  }, function (error, user) {
    if (error) {
      console.log(error)
    } else {
      if (!user) {
        res.status(401).send('username not found')
      } else {
        bcrypt.compare(userData.password, user.password).then(function (resp) {
          if (resp === false) {
            res.status(401).send('Invalid password')
          } else {
            if ((user.roles.indexOf(userData.role_request) > -1)) {
              if (user.roles[0] === 3 && user.school.registration_valid === true) {
                res.status(401).send('You are not authorized to login here')
              } else {
                let payload = {
                  subject: user._id
                }
                let token = jwt.sign(payload, "secretKey")
                let role = userData.role_request
                res.status(200).send({ status: false, _id: user._id })
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



router.post('/login', (req, res) => {
  let userData = req.body;
  User.findOne({
    username: userData.username
  }, function (error, user) {
    if (error) {
      console.log(error)
    } else {
      if (!user) {
        res.status(401).send('username not found')
      } else {
        bcrypt.compare(userData.password, user.password).then(function (resp) {
          if (resp === false) {
            res.status(401).send('Invalid password')
          } else {
            if ((user.roles.indexOf(userData.role_request) > -1)) {
              if (user.roles[0] === 3 && user.school.registration_valid === false) {
                res.status(401).send('You are not authorized to login as a school')
              } else {
                let payload = {
                  subject: user._id
                }
                let token = jwt.sign(payload, "secretKey")
                let role = userData.role_request
                res.status(200).send({ token, user, role })
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

router.post('/save_school_data', (req, res) => {
  let schoolData = req.body;

  User.update({ _id: schoolData.school_id }, {
    $set: {
      school: {
        school_name: schoolData.school_name,
        principal_first_name: schoolData.principal_first_name,
        principal_last_name: schoolData.principal_last_name,
        description: schoolData.description,
        registration_valid: true
      }
    }

  }, function (err, result) {
    if (err) {
      res.status(401).send(err)
    } else {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(schoolData.password, salt, function (err, hash) {
          schoolData.password = hash;
          User.update({ _id: schoolData.school_id }, {
            $set: {
              password: hash
            }
          }, function (err, result) {
            if (err) {
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

router.post('/create_new_teacher', (req, res) => {
  let dataTeacher = req.body;
  let currentSchoolId = req.query.school_id;
  User.findOne({ username: dataTeacher.username }, function (err, teacher) {
    if (err) {
      console.log(err)
    } else {
      if (teacher) {
        res.status(404).send({ msg: "Username already in use" })
      } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(dataTeacher.password, salt, function (err, hash) {
            dataTeacher.password = hash;
            let user = new User(dataTeacher)
            user.save((error, registerTeacher) => {
              if (err) {
                console.log(err)
              } else {
                User.update({ _id: currentSchoolId }, {
                  $push: {
                    "school.teacher": {
                      _id: registerTeacher._id
                    }
                  }
                }, function (err, data) {
                  if (err) {
                    console.log(err)
                  } else {
                    User.update({ _id: registerTeacher._id }, {
                      $push: {
                        "teacher.schools": {
                          _id: currentSchoolId
                        }
                      }
                    }, function (err, data) {
                      if (err)
                        console.log(err)
                      else
                        res.status(200).send({ msg: 'New teacher has been added' })
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

// Chat-module endpoints.

router.post('/add_message', (req, res) => {
  let msg = req.body;
  if (msg.sender.role_type === 'Admin') {
    User.find({}, function (error, users) {
      if (error) {
        console.log(error);
        res.status(401).send({ "status": "fail", "msg": "Something went wrong!!" });
      } else {
        users.forEach((emt, index, arr) => {
          const role_type = getRoleType(emt.roles[0]);
          let obj = {
            "nickname": emt.first_name + ' ' + emt.last_name,
            "id": emt._id,
            "role_type": role_type
          }
          msg['receiver'] = obj;

          saveMsg(msg, (flag) => {
            if (!flag) {
              res.status(401).send({ "status": "fail", "msg": "Something went wrong!!" });
            }
            if (!arr[index + 1]) {
              res.status(200).send({ "status": "success", "msg": "Message send successfully!!" });
            }
          });
        });
      }
    })
  } else {
    saveMsg(msg, (flag) => {
      if (!flag) {
        res.status(401).send({ "status": "fail", "msg": "Something went wrong!!" });
      }
      else {
        res.status(200).send({ "status": "success", "msg": "Message send successfully!!" });
      }
    });
  }
})

router.get('/get_messages', (req, res) => {
  Message.update({ "receiver.id": req.query.receiverId }, {
    $set: {
      "read_flag": true
    }, 
  }, { "multi": true }, function (err, data) {
    if (err) {
      console.log('err' + JSON.stringify(err));
      res.status(401).send({ "status": "fail", "msg": "Something went wrong!!" })
    }
    else {
      Message.find({ $or: [{ "receiver.id": req.query.receiverId }, { "sender.id": req.query.senderId }] }, (err, data) => {
        if (err) {
          res.status(401).send({ "status": "fail", "msg": "Something went wrong!!" })
        } else {
          res.status(200).send({ "status": "success", "data": data })
        }
      })
    }
  })
})

router.get('/get_unread_count', (req, res) => {
  Message.find({$and: [{ "receiver.id": req.query.id },{ "read_flag": false },]}, (err, data) => {
    if (err) {
      res.status(401).send({ "status": "fail", "msg": "Something went wrong!!" })
    } else {
      res.status(200).send({ "status": "success", "data": data })
    }
  }).count()
})

function getRoleType(roleId) {
  let roleName = '';
  if (+roleId === 1) {
    roleName = "Admin"
  } else if (+roleId === 2) {
    roleName = "Editor"
  } else if (+roleId === 3) {
    roleName = "School"
  } else if (+roleId === 4) {
    roleName = "School-staff"
  } else if (+roleId === 5) {
    roleName = "Teacher"
  } else if (+roleId === 6) {
    roleName = "Students"
  }
  return roleName;
}

function saveMsg(msg, callback) {
  let message = new Message(msg)
  message.save((error, chat_res) => {
    if (error) {
      console.log(error);
      callback(false);
    } else {
      callback(true);
    }
  })
}


module.exports = router;
