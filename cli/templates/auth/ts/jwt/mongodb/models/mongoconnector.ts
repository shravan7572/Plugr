import mongoose from "mongoose";

export const connectdb = async () => {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        console.error("unable to connect DB: MONGO_URL is missing in environment variables.");
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoUrl)
        console.log("mongoo DB connected.")
    } catch (e) {
        console.log("unable to conneect DB")
        process.exit(1)
    }
}

//just call connectdb() in index.js


// DO THIS IN INDEX.TS
//import dotenv from"dotenv"
//dotenv.config()