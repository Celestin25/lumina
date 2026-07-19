import { createClient } from "@libsql/client/web/index.js";

let remoteUrl = "libsql://lumina-db-celestin25.aws-us-east-1.turso.io";

if (remoteUrl.startsWith("libsql://")) {
  remoteUrl = remoteUrl.replace("libsql://", "https://");
}

try {
  const libsql = createClient({ url: remoteUrl, authToken: "fake_token_for_test" });
  console.log("Client created successfully with URL:", remoteUrl);
} catch (e) {
  console.error("Error creating client:", e.message);
}
