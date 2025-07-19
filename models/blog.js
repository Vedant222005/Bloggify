const mongoose=require('mongoose');
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true 
    },
    body:{
        type:String,
        required:true
    },
    coverImageURL:{
        type:String,
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    author:{
        type:String,
        required:true
    },
    likes: {
        type: Number,
        default: 0
      },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }],
    comments: [{
        text: String,
        commentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
},{timestamps:true} )

const blog=mongoose.model('blog',blogSchema)
module.exports=blog
