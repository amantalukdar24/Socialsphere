const {Schema,model}=require('mongoose');

const storySchema=new Schema({
    story:{
           
            fileType:String,
            filePath:String,
            public_id:String,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
     createdAt: { type: Date, default: Date.now, index: { expires: '24h' } }
});

const STORY=model('story',storySchema);

module.exports=STORY;