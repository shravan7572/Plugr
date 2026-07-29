import inquirer from "inquirer";

export const emailpromt= async ()=>{
    const Answers=await inquirer.prompt([
        {
            type:"select",
            name:"Email",
            message:"Choose email provider",
            choices:["Nodemailer","Brevo"]
        }
    ])

    return Answers
}