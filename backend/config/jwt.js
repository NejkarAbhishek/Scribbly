import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, "thisismynewsecret", { expiresIn: "30d" });
};
