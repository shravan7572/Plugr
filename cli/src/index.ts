#!/usr/bin/env node
import { Command } from "commander";
import { authpromt } from "./features/auth/prompts.js";
import { logger } from "./utils/logger.js";
import { emailpromt } from "./features/email/emailprompt.js";
const program = new Command()

program
    .name("plugr")
    .description("drop the feature in existing express project")
    .version("1.0.0")
 

program
    .command("add <feature>")
    .action(async (feature: string) => {
        if (feature === "auth") {
            const answers = await authpromt()
            console.log(answers)
            logger.success("Got your choices!")
            logger.info(`Language: ${answers.language}`)
            logger.info(`Auth: ${answers.Auth}`)
        }
       

         if (feature === "email") {
            const Answers = await emailpromt()
            console.log(Answers)
            logger.success("Got your choices!")
            logger.info(`Emailprovider: ${Answers.Email}`)
            
        }

         else{
            logger.error(`Unknown feature ${feature}`)
        }
      

    })

program.parse()
