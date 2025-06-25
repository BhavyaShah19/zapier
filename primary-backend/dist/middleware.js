"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function authMiddleware(req, res, next) {
    console.log("auth middleware");
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decodedPayloaded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        //@ts-ignore
        req.id = decodedPayloaded.id;
        next();
    }
    catch (error) {
        res.status(403).json({ message: "You are not logged in" });
    }
}
