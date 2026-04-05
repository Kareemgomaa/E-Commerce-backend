import jwt from "jsonwebtoken";
import userModel from "../database/model/user.model.js";

export const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ message: "Token is required" });
        }

        if (!authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        const user = await userModel.findById(decoded._id).select('-password');

        if (!user ) {
            return res.status(401).json({ message: "The user associated with this token does not exist." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
};

export const generateToken = (user) => {
    if (!user) {
        console.error("Error: user object is undefined in generateToken");
        return null;
    }
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: "24h" });
    return token;
};
export const generateRefreshToken = (user) => {
    if (!user) {
        console.error("Error: user object is undefined in generateToken");
        return null;
    }
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET || 'default_secret', { expiresIn: "7d" });
    return token;
};

export const allowedRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated. Ensure 'auth' middleware is placed before 'allowedRoles'." });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You are not authorized to perform this action." });
        }
        next();
    };
};
