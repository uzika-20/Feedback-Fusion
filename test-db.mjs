import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

console.log("🔌 Connecting to PostgreSQL...");

try {
  await client.connect();

  console.log("✅ PostgreSQL connection successful");

  const result = await client.query("SELECT NOW()");

  console.log("✅ Database responded:");
  console.log(result.rows[0]);

  await client.end();

  console.log("✅ Connection closed");
} catch (error) {
  console.error("❌ PostgreSQL connection failed:");
  console.error(error);

  try {
    await client.end();
  } catch {}
}