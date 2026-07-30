import { authpromt } from "./prompts.js"
import { copyTemplateDir } from "../../utils/writer.js"
import { logger } from "../../utils/logger.js"

export const addAuth = async () => {
    logger.title("Plugr — Adding Auth")

    const { language, Auth } = await authpromt()

    const lang = language === "typescript" ? "ts" : "js"
    const authType = Auth === "JWT" ? "jwt" : "better-auth"
    const templatePath = `auth/${lang}/${authType}/mongodb`

    logger.info("Copying template files...")
    if (Auth === "JWT") {
    await copyTemplateDir(`${templatePath}/models`, "src/models")
    await copyTemplateDir(`${templatePath}/middleware`, "src/middleware")
    await copyTemplateDir(`${templatePath}/controllers`, "src/controllers")
    await copyTemplateDir(`${templatePath}/routes`, "src/routes")
    await copyTemplateDir(`${templatePath}/config`, "src/config")
    }else{
    await copyTemplateDir(`${templatePath}/middleware`, "src/middleware")
    await copyTemplateDir(`${templatePath}/routes`, "src/routes")
    await copyTemplateDir(`${templatePath}/config`, "src/config")
    }
    logger.success("Auth added to your project!")

    console.log("\nIf not already installed, run:")
    logger.info("\n Run: pnpm/npm/yarn/bun install")

   if (Auth === "JWT") {
    console.log(`   import authRoutes from "./routes/auth.routes.js"`)
    console.log(`   app.use("/api/auth", authRoutes)`)
} else {
    console.log(`\n   1. Add to your index.ts BEFORE express.json():`)
    console.log(`      import authRoutes from "./routes/auth.routes.js"`)
    console.log(`      app.use(authRoutes)`)
    console.log(`\n   2. Install dependencies:`)
    console.log(`      npm install better-auth zod mongodb`)
    console.log(`\n   3. Fill in your .env file`)
    console.log(`\n   ⚡ Better Auth handles /api/auth/* automatically!`)
}
}