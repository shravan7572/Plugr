import inquirer from "inquirer"

export const authpromt = async () => {
    const answers = await inquirer.prompt([
        {
            type: "select",
            name: "language",
            message: "Choose language:",
            choices: ["typescript", "javascript"]
        },
        {
            type: "select",
            name: "Auth",
            message: "Choose auth type:",
            choices: ["JWT", "Better-auth"]
        }
    ])

    return answers
}