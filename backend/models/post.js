const {Schema,model}=require('mongoose');

const postSchema=new Schema({
    caption:{
        type:String,

    },
    media:[
        {
            fileName:String,
            fileType:String,
            filePath:String,
            public_id:String,
            postNo:Number,
        }
    ],
   userId:{
    type:Schema.Types.ObjectId,
    ref:'user'
   },
  
},{timestamps:true});

const POST=model("post",postSchema);

module.exports=POST;