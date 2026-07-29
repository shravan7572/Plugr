import inquirer from "inquirer";

export const authpromt = async () => {
   const answers= await inquirer.prompt([

    {
        type:"select",
        name:"language",
        message:"choose language",
        choices:["typescript","javascript"]
    },

       {
        type:"select",
        name:"Auth",
        message:"choose authentication",
        choices:["JWT","Better-auth"]
    },
    {
        type:"select",
        name:"package",
        message:"Choose package manager",
        choices:["pnpm","npm","yarn","bun"]
    }

    ])

    return answers
}

