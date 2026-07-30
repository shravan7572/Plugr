import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI as string);

await client.connect();

export const db = client.db();
export { client };