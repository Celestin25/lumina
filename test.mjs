import { createClient } from "@libsql/client/web/index.js";

const remoteUrl = "libsql://lumina-db-celestin25.aws-us-east-1.turso.io";

try {
  const libsql = createClient({ url: remoteUrl, authToken: "fake" });
  console.log("Client created successfully");
} catch (e) {
  console.error("Error creating client:", e.message);
}
