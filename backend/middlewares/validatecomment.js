require("dotenv").config();
const { GoogleGenAI } =require("@google/genai");
const ai = new GoogleGenAI({apiKey:process.env.Gemni_API_KEY});

async function ValidateComment(req,res,next){
      try {
        const {comment}=req.body;
        if(comment.length==0) return res.status(400).json({success:false,mssg:"Comment is empty"});
        const prompt=comment+".Check the sentence content any vulgur,nudity,threat like comments if yes return true else false";
    
         const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

     if(response.text.toLowerCase().includes("false")) return next();
     return res.status(400).json({success:false,mssg:"Comment cannot be post.Comment contain offensive comments"});    
        
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({success:false,mssg:"Internal Server Down"});
    }
}
module.exports={
    ValidateComment,
}