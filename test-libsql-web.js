import { createClient } from "@libsql/client/web";

const remoteUrl = "libsql://lumina-db-celestin25.aws-us-east-1.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN;

try {
  const libsql = createClient({ url: remoteUrl, authToken });
  console.log("Client created successfully");
} catch (e) {
  console.error("Error creating client:", e);
}
