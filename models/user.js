const mongoose = require('mongoose')
const schema = mongoose.Schema;


//schema for geolocation and others

const userSchema = new schema({
  username: String,
  password: String,
  first_name: String,
  last_name:String,
  email: String,
  phone_number: Number,
  profile_photo: String,
  roles:[{
    type: Number
}]
})

module.exports = mongoose.model('user',userSchema,'users')
