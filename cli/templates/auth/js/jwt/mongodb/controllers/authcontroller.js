
import { UserModel } from "../models/usermodel.js"
import { generateToken } from "../config/jwt.js"
import bcrypt from "bcrypt"
import { z } from "zod"

const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8)
})

export const signup = async (req, res) => {
    try {
        const parsed = signupSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error.issues[0].message })
        }

        const { name, email, password } = parsed.data

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await UserModel.create({ name, email, password: hashedPassword })

        res.status(201).json({ message: "Signed up successfully." })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password." })
        }

        const token = generateToken(user._id.toString())
        res.json({ token })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}