const JWT= require("jsonwebtoken")
const secret="vedant123"

function createToken(user){
    const payload={
        _id:user._id,
        username: user.username, 
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role
    };
    const token=JWT.sign(payload,secret);
    return token
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}
module.exports={
    createToken,
    validateToken
}