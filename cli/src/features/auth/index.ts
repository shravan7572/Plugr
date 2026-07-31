import { authpromt } from "./prompts.js"
import { copyTemplateDir } from "../../utils/writer.js"
import { logger } from "../../utils/logger.js"
import { detectPackageManager, installDependencies, getInstallCommand } from "../../utils/packageManager.js"
import inquirer from "inquirer"
import fs from "fs-extra"
import path from "path"

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

    // Determine dependencies
    let deps: string[] = []
    let devDeps: string[] = []

    if (Auth === "JWT") {
        deps = ["jsonwebtoken", "bcryptjs", "mongoose", "dotenv", "cors","express"]
        if (language === "typescript") {
            devDeps = ["@types/jsonwebtoken", "@types/bcryptjs"]
        }
    } else {
        deps = ["better-auth", "mongodb", "dotenv", "cors"]
    }

    const { pm: detectedPm, detected } = await detectPackageManager()
    let pm = detectedPm

    if (!detected) {
        const answers = await inquirer.prompt([
            {
                type: "select",
                name: "pm",
                message: "Which package manager do you want to use?",
                choices: ["npm", "pnpm", "yarn", "bun"],
                default: detectedPm
            }
        ])
        pm = answers.pm
    }
    
    const installCmds = getInstallCommand(pm, deps, devDeps)

    logger.info(`Required dependencies for your selection:`)
    if (installCmds.install) logger.info(installCmds.install)
    if (installCmds.installDev) logger.info(installCmds.installDev)

    const { shouldInstall } = await inquirer.prompt([
        {
            type: "confirm",
            name: "shouldInstall",
            message: `Would you like to automatically install these dependencies using ${pm}?`,
            default: true
        }
    ])

    if (shouldInstall) {
        await installDependencies(pm, deps, devDeps)
    } else {
        logger.warn("Skipped package installation. Remember to install them manually!")
    }

    console.log("\nThen add to your index.ts:")
    console.log(`app.use("/api/auth", authRoutes)`)
}