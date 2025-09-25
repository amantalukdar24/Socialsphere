const {Schema,model}=require("mongoose");

const likeSchema=new Schema({
    postId:{
        type:Schema.Types.ObjectId,
        ref:"post",
    
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
       
    }
},{
    timestamps:true
});
const LIKE=model("like",likeSchema);
module.exports=LIKE;
