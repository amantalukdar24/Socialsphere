const {Schema,model}=require('mongoose');


const otpSchema=new Schema({
    email:{
         type:String,
         required:true,
         unique:true
    },
    otp:{
         type:String,
           
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:600
    }

});

const OTP=model("otp",otpSchema);

module.exports=OTP;