import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../config/auth.js";

const router = Router()

// better-auth handles EVERYTHING — signup, signin, signout, session
router.all("/api/auth/*", toNodeHandler(auth))

export default router