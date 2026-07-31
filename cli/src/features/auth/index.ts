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
    } else {
        await copyTemplateDir(`${templatePath}/middleware`, "src/middleware")
        await copyTemplateDir(`${templatePath}/routes`, "src/routes")
        await copyTemplateDir(`${templatePath}/config`, "src/config")
    }
    logger.success("Auth added to your project! 🎉")

    if (Auth === "JWT") {
        logger.info(language === "typescript"
            ? "pnpm add jsonwebtoken bcryptjs mongoose dotenv cors && pnpm add -D @types/jsonwebtoken @types/bcryptjs"
            : "pnpm add jsonwebtoken bcryptjs mongoose dotenv cors"
        )
    } else {
        logger.info("pnpm add better-auth mongodb dotenv cors")
    }

    console.log("\nThen add to your index.ts:")
    console.log(`app.use("/api/auth", authRoutes)`)
}