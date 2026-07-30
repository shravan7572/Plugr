import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./db.js";

export const auth = betterAuth({
    database: mongodbAdapter(db),
    trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,        // 7 days
        updateAge: 60 * 60 * 24,              // refresh if 1 day old
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5                    // 5 min cache
        }
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        }
    }
})