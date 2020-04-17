const mongoose = require('mongoose')
const schema = mongoose.Schema;


//schema for geolocation and others

const userSchema = new schema({
  username: {
    type: String,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  first_name: {
    type: String,
    default: null
  },
  last_name:{
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  phone_number: {
    type: Number,
    default: null
  },
  profile_photo: {
    type: String,
    default: null
  },
  roles:[{
    type: Number
}],
school:{
  school_name:{
    type:String,
    default:null
  },
  principal_first_name:{
    type:String,
    default:null
  },
  principal_last_name:{
    type:String,
    default:null
  },
  access: {
    type:Boolean,
    default: false
  },
  registration_valid:{
    type:Boolean,
    default:false
  },
  description: {
    type:String,
    default:null
  },
  curriculums:[
    {
      type:String,
      default:null
    }
  ],
  teacher:[{
    _id:{
      type:String,
      default:null
    },
    first_name:{
      type:String,
      default:null
    },
    last_name:{
      type:String,
      default:null
    }
  }]
}

})

module.exports = mongoose.model('user',userSchema,'users')
