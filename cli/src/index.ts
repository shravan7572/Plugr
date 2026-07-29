#!/usr/bin/env node
import {Command} from "commander" ;
import { authpromt } from "./features/auth/prompts";
const program = new Command()

program
.name("plugr")
.description("drop the feature in existing express project")
.version("1.0.0")


program
.command("add <feature>")
.description("add feature to project")
.action(async (feature:string)=>{
   if(feature==="auth"){
    const answer=await authpromt()
    console.log(answer)
   }
})

program.parse()
