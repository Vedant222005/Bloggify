const { validateToken } = require("../services/auth");

function checkForAuthentication(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next(); // No token, proceed as unauthenticated
    }
    try {
      const payload = validateToken(tokenCookieValue); // ✅ Fixed function call
      req.user = payload; // ✅ Attach user to request
    } catch (error) {
      console.error("Invalid token:", error.message);
    }
    next();
  };
}

module.exports = {
  checkForAuthentication,
};
