import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const token = authorization.replace("Bearer ", "");
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ _id: id });
    if (!user) res.status(403).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "middleware : " + error.message });
  }
};

export { isAuth };
