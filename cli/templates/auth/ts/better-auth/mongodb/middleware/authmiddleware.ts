import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// extend express Request type
declare global {
    namespace Express {
        interface Request {
            user?: typeof auth.$Infer.Session.user
            session?: typeof auth.$Infer.Session.session
        }
    }
}

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            res.status(401).json({
                success: false,
                message: "Unauthorized — please sign in"
            })
            return
        }

        req.user = session.user
        req.session = session.session
        next()
    } catch {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
}
