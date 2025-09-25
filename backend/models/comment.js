const {Schema,model}=require("mongoose");

const commentSchema=new Schema({
    comment:{
        type:String,

    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"post"
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }
},{
    timestamps:true
});

const COMMENT=model("comment",commentSchema);

module.exports=COMMENT