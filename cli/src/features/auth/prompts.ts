import inquirer from "inquirer";

export const authpromt = async () => {
   const answers= await inquirer.prompt([

    {
        type:"list",
        name:"language",
        message:"choose language",
        choices:["typescript","javascript"]
    },

       {
        type:"list",
        name:"Auth",
        message:"choose authentication",
        choices:["JWT","Better-auth"]
    },

    ])

    return answers
}

