import { emailpromt } from "./emailprompt.js"
import { copyTemplateDir } from "../../utils/writer.js"
import { logger } from "../../utils/logger.js"

export const addemail = async () => {
    logger.title("Plugr — Adding email")

    const { language, Email } = await emailpromt()

    const lang = language === "typescript" ? "ts" : "js"
    const emailtype = Email === "Nodemailer" ? "Nodemailer" : "Brevo"
    const templatePath = `email/${lang}/${emailtype}/`

    logger.info("Copying template files...")

    await copyTemplateDir(`${templatePath}/transporter`, "src/transporter")
    await copyTemplateDir(`${templatePath}/emailsource`, "src/emailsource")

    logger.success("email added to your project!")

    logger.info("\n Run: pnpm/npm/yarn/bun install")

    console.log("\nThen add this to your index.ts:")
    
    logger.success("done email added")
}