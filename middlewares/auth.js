const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
require("dotenv").config();
const jwt_secret = process.env.jwt_secret;
const jwt_expires_in = "1h";

function signToken(userId) {
  return jwt.sign({ id: userId }, jwt_secret, { expiresIn: jwt_expires_in });
}

async function protect(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer")) token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "You must login" });

    const decoded = jwt.verify(token, jwt_secret);
    const user = await userModel.findById(decoded.id).lean();
    if (!user)
      return res.status(401).json({ message: "USer no longer exists" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
}

module.exports = { signToken, protect };
