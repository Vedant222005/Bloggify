const mongoose = require('mongoose');
const {createHmac, randomBytes}=require('crypto');
const { createToken } = require('../services/auth');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique:true,
    lowercase: true,
    trim: true
  },
  salt:{
    type:String,
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  profileImageURL: {
    type: String,
    default: '/images/user'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  following:[{
    type:mongoose.Schema.ObjectId,
    ref:'user'
  }]

});

userSchema.pre("save",function(next){
     const user=this;
     if(!user.isModified('password')) return;
     const salt=randomBytes(16).toString();
     const hassedPassword=createHmac("sha256",salt)
        .update(user.password)
        .digest("hex")
    this.salt=salt;
    this.password=hassedPassword;

    next();
})

userSchema.static("ismatchedAndGenrateToken" ,async function(email,password){
  const user=await this.findOne({email})
  if(!user) throw new Error ("user not found");
  const salt=user.salt;
  const userprovidedpass=user.password
  
  const hassedPassword=createHmac("sha256",salt)
        .update(password)
        .digest("hex")

  if(userprovidedpass!=hassedPassword)  throw new Error ("incorrect password");
  const token=createToken(user)
  return token;
})

const user=mongoose.model('user',userSchema)
module.exports = user
