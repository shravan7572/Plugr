import inquirer from "inquirer";

export const emailpromt= async ()=>{
    const Answers=await inquirer.prompt([
        {
            type:"select",
            name:"Email",
            message:"Choose email provider",
            choices:["Nodemailer","Brevo"]
        },
         {
        type:"select",
        name:"package",
        message:"Choose package manager",
        choices:["pnpm","npm","yarn","bun"]
    }
    ])

    return Answers
}