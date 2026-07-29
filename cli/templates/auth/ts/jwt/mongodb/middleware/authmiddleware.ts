import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            userid?: string
        }
    }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token as string

    if (!token) {
        return res.status(401).json({ message: "Token not provided." })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.userid = decoded.id
        next()
    } catch (e: any) {
        res.status(401).json({ message: "Invalid token." })
    }
}