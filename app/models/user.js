const mongoose = require('mongoose');
const { ObjectID } = require('mongoose/lib/schema/index');
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
  _schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () { return new mongoose.Types.ObjectId}
},
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
      type:mongoose.Schema.Types.ObjectId,
      default:null
    }
  ],
  teacher:[{
    _id:{
      type:String,
      default:null
    }
  }]
},
teacherInSchool:{
  schools:[{
    _id:{
      type:String,
      default:null
    }
  }]
},
school_id :{
  type : mongoose.Schema.Types.ObjectId
}

})

module.exports = mongoose.model('user',userSchema,'users')
