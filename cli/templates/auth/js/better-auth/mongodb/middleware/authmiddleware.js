import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";


export const requireAuth = async (req, res, next) => {
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
