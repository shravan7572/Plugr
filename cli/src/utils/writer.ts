import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url) //this file path
const __dirname = path.dirname(__filename)//folder path to this file

export const copyTemplateDir = async (templatePath: string, destPath: string) => {
    const fullTemplatePath = path.join(__dirname, "../../templates", templatePath)
    const fullDestPath = path.join(process.cwd(), destPath)

    await fs.ensureDir(fullDestPath)
    await fs.copy(fullTemplatePath, fullDestPath)
}