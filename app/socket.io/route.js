const  express  = require("express");
const  db  = require("../core/config/db.config");
const  chatModel  = require("../models/chat/chat.model");
const  router  =  express.Router();

router.route("/:FromId").get(async (req, res) => {
try {       
      const result= await chatModel.find({From:req.params.FromId,GroupId:null})      
            res.send(result);        
    }
    catch (error) {
        console.log("err:", error);
        res.status(500).send({
          message: "Error retrieving chat with id " + req.params.FromId,
        });
      }
});

module.exports  =  router;