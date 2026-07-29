import jwt from "jsonwebtoken"

export const requireAuth = (req, res, next) => {
    const token = req.headers.token 

    if (!token) {
        return res.status(401).json({ message: "Token not provided." })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) 
        req.userid = decoded.id
        next()
    } catch (e) {
        res.status(401).json({ message: "Invalid token." })
    }
}