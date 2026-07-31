import * as sibSdk from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const apiInstance = new sibSdk.TransactionalEmailsApi();

const apiKey = process.env.BREVO_API_KEY || "";
apiInstance.setApiKey(sibSdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

export { apiInstance };
