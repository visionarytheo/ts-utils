// scripts/migrate.ts
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import fs from "fs";
import path from "path";

// Automatically loads .env.local from the project root natively
loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL environment variable.");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 });

async function runMigration() {
  try {
    const migrationsDir = path.join(process.cwd(), "db", "migrations");

    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migration directory not found at ${migrationsDir}`);
    }

    // Read directory and filter for .sql files sorted sequentially
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("ℹ️ No migration files found to execute.");
      return;
    }

    console.log(
      `⏳ Found ${files.length} migration files. Starting execution loop...`,
    );

    // Execute each migration sequentially in a transaction block
    await sql.begin(async (sqlTx) => {
      for (const file of files) {
        console.log(`⚡ Executing: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sqlQuery = fs.readFileSync(filePath, "utf8");

        // Use the transaction token to execute unsafe raw strings securely
        await sqlTx.unsafe(sqlQuery);
      }
    });

    console.log(
      "✅ All schema migrations executed successfully! Structural baselines established.",
    );
  } catch (error) {
    console.error("❌ Migration engine encountered a failure:", error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

runMigration();

