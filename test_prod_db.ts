import { createClient } from "@libsql/client/web";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

async function test() {
  try {
    console.log("Connecting to Turso...");
    let url = "libsql://lumina-db-celestin25.aws-us-east-1.turso.io";
    if (url.startsWith("libsql://")) url = url.replace("libsql://", "https://");
    
    const libsql = createClient({ 
      url: url, 
      authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQyMTQzODcsImlkIjoiMDE5YzljNzItNzMwMS03Mjg3LTg2Y2QtZTdmZDAwOTg3ZmZkIiwicmlkIjoiMTczMWMxMmEtYTdmYy00ZGM0LWIzNzQtZjYyOTczOWEwOGI3In0.Zpj4X2b2f7QjRyBqlZFBf6pkNh8crMNVGHwzDbyH3JjXPwDEj8yTvQY9Vp9Ni--KLL9kR4j1CR0MIoo-8Dd3CQ" 
    });
    const adapter = new PrismaLibSQL(libsql);
    const prisma = new PrismaClient({ adapter });

    console.log("Querying users...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);

    console.log("Testing user creation...");
    const testEmail = `test_${Date.now()}@example.com`;
    const newUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: testEmail,
        password: "hashedpassword",
        role: "CLIENT"
      }
    });
    console.log("Successfully created user:", newUser.email);
    await prisma.user.delete({ where: { id: newUser.id } });
    console.log("Successfully deleted test user. Writes perfect.");
    process.exit(0);
  } catch (err) {
    console.error("FATAL ERROR:", err);
    process.exit(1);
  }
}

test();
