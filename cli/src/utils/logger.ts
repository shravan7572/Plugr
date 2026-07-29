import chalk from "chalk"

export const logger = {
    success: (msg: string) => console.log(chalk.green(`✓ ${msg}`)),
    error: (msg: string) => console.log(chalk.red(`✗ ${msg}`)),
    info: (msg: string) => console.log(chalk.blue(`→ ${msg}`)),
    warn: (msg: string) => console.log(chalk.yellow(`⚠ ${msg}`)),
    title: (msg: string) => console.log(chalk.bold.white(`\n${msg}\n`)),
}