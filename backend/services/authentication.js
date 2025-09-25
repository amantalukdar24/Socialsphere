require('dotenv').config();
const jwt=require('jsonwebtoken');

function createTokenForUser(user){
    const payload={
        _id:user._id,
        name:user.name,
        email:user.email,
        username:user.username

    }
    const token=jwt.sign(payload,process.env.JWT_Secret_Key);
    return token;
}
function verifyToken(token){
    const payload=jwt.verify(token,process.env.JWT_Secret_Key);
    return payload;
}
module.exports={
    createTokenForUser,
    verifyToken
}