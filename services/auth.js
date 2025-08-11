const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "vedant123";

function createToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role
  };
  const token = JWT.sign(payload, secret, { expiresIn: '24h' });
  return token;
}

function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = {
  createToken,
  validateToken
};