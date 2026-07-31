import fs from "fs-extra"
import path from "path"
import { execSync } from "child_process"
import { logger } from "./logger.js"

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

export const detectPackageManager = async (): Promise<{ pm: PackageManager; detected: boolean }> => {
    const cwd = process.cwd()

    // 1. Check lock files in current working directory
    if (await fs.pathExists(path.join(cwd, "pnpm-lock.yaml"))) return { pm: "pnpm", detected: true }
    if (await fs.pathExists(path.join(cwd, "package-lock.json"))) return { pm: "npm", detected: true }
    if (await fs.pathExists(path.join(cwd, "yarn.lock"))) return { pm: "yarn", detected: true }
    if (await fs.pathExists(path.join(cwd, "bun.lockb"))) return { pm: "bun", detected: true }

    // 2. Fallback to process.env.npm_config_user_agent
    const userAgent = process.env.npm_config_user_agent
    if (userAgent) {
        if (userAgent.startsWith("pnpm")) return { pm: "pnpm", detected: true }
        if (userAgent.startsWith("yarn")) return { pm: "yarn", detected: true }
        if (userAgent.startsWith("bun")) return { pm: "bun", detected: true }
        if (userAgent.startsWith("npm")) return { pm: "npm", detected: true }
    }

    return { pm: "npm", detected: false } // Default fallback, not confidently detected
}

export const getInstallCommand = (pm: PackageManager, deps: string[], devDeps: string[] = []) => {
    switch (pm) {
        case "npm":
            return {
                install: deps.length ? `npm install ${deps.join(" ")}` : "",
                installDev: devDeps.length ? `npm install --save-dev ${devDeps.join(" ")}` : ""
            }
        case "yarn":
            return {
                install: deps.length ? `yarn add ${deps.join(" ")}` : "",
                installDev: devDeps.length ? `yarn add -D ${devDeps.join(" ")}` : ""
            }
        case "bun":
            return {
                install: deps.length ? `bun add ${deps.join(" ")}` : "",
                installDev: devDeps.length ? `bun add -d ${devDeps.join(" ")}` : ""
            }
        case "pnpm":
        default:
            return {
                install: deps.length ? `pnpm add ${deps.join(" ")}` : "",
                installDev: devDeps.length ? `pnpm add -D ${devDeps.join(" ")}` : ""
            }
    }
}

export const installDependencies = async (pm: PackageManager, deps: string[], devDeps: string[] = []) => {
    const cmds = getInstallCommand(pm, deps, devDeps)
    
    try {
        if (cmds.install) {
            logger.info(`Running: ${cmds.install}`)
            execSync(cmds.install, { stdio: "inherit" })
        }
        if (cmds.installDev) {
            logger.info(`Running: ${cmds.installDev}`)
            execSync(cmds.installDev, { stdio: "inherit" })
        }
        logger.success("Dependencies installed successfully!")
    } catch (error) {
        logger.error(`Failed to install dependencies. Please run manually:`)
        if (cmds.install) logger.info(cmds.install)
        if (cmds.installDev) logger.info(cmds.installDev)
    }
}
