import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET 

export const generateToken = (id)=> {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" })
}

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}