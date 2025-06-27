import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export function authMiddleware  (req: Request, res: Response, next: NextFunction) {

    console.log("auth middleware")
    const token = req.headers.authorization
    if (!token) {
        res.status(401).json({ message: "No token provided" })
        return
    }
    try {
        const decodedPayloaded = jwt.verify(token, JWT_PASSWORD)
        //@ts-ignore
        req.id = decodedPayloaded.id
        next();
    } catch (error) {
        
        res.status(403).json({ message: "You are not logged in" })
    }
} 