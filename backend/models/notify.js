const {Schema,model}=require("mongoose");

const notifySchema=new Schema({
    type:{
        type:String,
        require:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    actorId: { type: Schema.Types.ObjectId, ref: "user", required: true },


    username:{
        type:String,
        required:true,
    },
    urlId:{
        type:String,
    }
},{
    timestamps:true,
});

const NOTIFY=model("notify",notifySchema);

module.exports=NOTIFY;