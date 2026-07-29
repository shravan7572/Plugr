import { execSync } from "child_process"
import { logger } from "./logger.js"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const getInstallCmd = (pm: PackageManager, dev: boolean = false): string => {
    const cmds = {
        npm: dev ? "npm install -D" : "npm install",
        pnpm: dev ? "pnpm add -D" : "pnpm add",
        yarn: dev ? "yarn add -D" : "yarn add",
        bun: dev ? "bun add -D" : "bun add"
    }
    return cmds[pm]
}

export const installDeps = (packages: string[], pm: PackageManager) => {
    const cmd = `${getInstallCmd(pm)} ${packages.join(" ")}`
    logger.info(`Installing: ${packages.join(", ")}`)
    execSync(cmd, { stdio: "inherit" })
    logger.success("Dependencies installed.")
}

export const installDevDeps = (packages: string[], pm: PackageManager) => {
    const cmd = `${getInstallCmd(pm, true)} ${packages.join(" ")}`
    logger.info(`Installing dev deps: ${packages.join(", ")}`)
    execSync(cmd, { stdio: "inherit" })
    logger.success("Dev dependencies installed.")
}