const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("No Bearer token provided");
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token);

  jwt.verify(token, process.env.JWT_A_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Access Token Expired" });
    }

    console.log("Decoded payload:", decoded); // Log the decoded payload

    req.user = { user_id: decoded.id }; // Ensure `id` is correct


    next();
  });
};

module.exports = verifyAccessToken;
