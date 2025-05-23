import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "thisismynewsecret");
      req.user = await User.findById(decoded.id).select("-password");
      req.userId = decoded.id;
      return next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If we reach here, no valid authorization header was found
  return res.status(401).json({ message: "Not authorized, no token" });
};

export default protect;
