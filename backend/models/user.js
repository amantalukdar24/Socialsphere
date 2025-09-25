const {Schema,model}=require('mongoose');

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:
    {
        type:String,
        required:true,
        unique:true
    },
    password:{
         type:String,
        required:true,
       
    },
    profile_photo:{
    type:String,
    default: "https://res.cloudinary.com/df0wzvbp1/image/upload/v1757871556/default_z1tjli.png" 
  
    },
    followers:[String],
    following:[String]
  
},{
    timestamps:true
});
const USER=model('user',userSchema);

module.exports=USER;