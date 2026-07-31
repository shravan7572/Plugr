import { emailpromt } from "./emailprompt.js"
import { copyTemplateDir } from "../../utils/writer.js"
import { logger } from "../../utils/logger.js"
import { detectPackageManager, installDependencies, getInstallCommand } from "../../utils/packageManager.js"
import inquirer from "inquirer"
import fs from "fs-extra"
import path from "path"

export const addemail = async () => {
    logger.title("Plugr — Adding Email")

    const { language, Email } = await emailpromt()

    const lang = language === "typescript" ? "ts" : "js"
    // Use lowercase for path folder matching (nodemailer / brevo)
    const emailtype = Email.toLowerCase()
    const templatePath = `email/${lang}/${emailtype}`

    logger.info("Copying template files...")

    await copyTemplateDir(`${templatePath}/transporter`, "src/transporter")
    await copyTemplateDir(`${templatePath}/emailsource`, "src/emailsource")

    logger.success("Email templates added to your project! 🎉")

    // Determine dependencies
    let deps: string[] = []
    let devDeps: string[] = []

    if (Email === "Nodemailer") {
        deps = ["nodemailer", "dotenv"]
        if (language === "typescript") {
            devDeps = ["@types/nodemailer"]
        }
    } else {
        deps = ["@getbrevo/brevo", "dotenv"]
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

    console.log("\nThen use it in your code:")
    if (language === "typescript") {
        console.log(`import { sendEmail } from "./src/emailsource/sendEmail.js"`)
    } else {
        console.log(`const { sendEmail } = require("./src/emailsource/sendEmail.js")`)
    }
}