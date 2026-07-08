// scripts/migrate.ts
import dotenv from "dotenv";
import postgres from "postgres";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL environment variable.");
  process.exit(1);
}

// Instantiate a temporary direct migration connection channel
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 });

async function runMigration() {
  try {
    console.log("⏳ Reading migration script from disk...");
    const filePath = path.join(process.cwd(), "migrations", "0000_init_auth_schema.sql");
    const sqlQuery = fs.readFileSync(filePath, "utf8");

    console.log("⚡ Executing raw schema definitions against Neon Postgres...");
    await sql.unsafe(sqlQuery);

    console.log("✅ Schema migration executed successfully! Table structural baselines established.");
  } catch (error) {
    console.error("❌ Migration engine encountered a failure:", error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

runMigration();
