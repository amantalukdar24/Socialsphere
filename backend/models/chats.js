const {Schema,model}=require("mongoose");

const chatSchema=new Schema({
    from:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    to:{
         type:Schema.Types.ObjectId,
         ref:"user",
        required:true,
    },
    message:{
         type:String,
        
    },
    mediapath:{
        fileType:String,
        filePath:String,
        public_id:String
    }

},{
    timestamps:true,
});

const Chats=model("chats",chatSchema);
module.exports=Chats;