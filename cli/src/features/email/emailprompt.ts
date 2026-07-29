import inquirer from "inquirer";

export const emailpromt= async ()=>{
    const Answers=await inquirer.prompt([
       
           {
            type: "select",
            name: "language",
            message: "Choose language:",
            choices: ["typescript", "javascript"]
        },
         {
            type:"select",
            name:"Email",
            message:"Choose email provider",
            choices:["Nodemailer","Brevo"]
        }
    ])

    return Answers
}