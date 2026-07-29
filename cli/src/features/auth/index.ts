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

    await copyTemplateDir(`${templatePath}/models`, "src/models")
    await copyTemplateDir(`${templatePath}/middleware`, "src/middleware")
    await copyTemplateDir(`${templatePath}/controllers`, "src/controllers")
    await copyTemplateDir(`${templatePath}/routes`, "src/routes")
    await copyTemplateDir(`${templatePath}/config`, "src/config")

    logger.success("Auth added to your project!")

    console.log("\nIf not already installed, run:")
    logger.info("\n Run: pnpm/npm/yarn/bun install")

    console.log("\nThen add this to your index.ts:")
    console.log(`   import authRoutes from "./routes/auth.routes.js"`)
    console.log(`   app.use("/api/auth", authRoutes)`)
}