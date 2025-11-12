const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // attach decoded data
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or has expired" });
  }
};

module.exports = authGuard;
