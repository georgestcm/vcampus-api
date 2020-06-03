const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb+srv://georges:vcampus2020@cluster0-fuxau.mongodb.net/vcampus?retryWrites=true&w=majority";
const  connect  =  mongoose.connect(url, { useNewUrlParser: true  }) .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

  
module.exports  =  connect;