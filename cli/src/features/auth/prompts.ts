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

    ])

    return answers
}

