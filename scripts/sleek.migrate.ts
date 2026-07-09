// scripts/migrate.ts
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import fs from "fs";
import path from "path";

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

    // 1. Ensure the tracking table exists baseline
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        file_name TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `;

    // 2. Fetch all previously executed migrations
    const executedRows = await sql`SELECT file_name FROM _migrations`;
    const executedFiles = new Set(executedRows.map(row => row.file_name));

    // 3. Read and sort disk files
    const allFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith(".sql"))
      .sort();

    // 4. Filter down to only files that HAVEN'T run yet
    const pendingFiles = allFiles.filter(file => !executedFiles.has(file));

    if (pendingFiles.length === 0) {
      console.log("✨ Database is completely up to date. No pending migrations.");
      return;
    }

    console.log(`⏳ Found ${pendingFiles.length} new migration files to apply.`);

    // 5. Execute new migrations sequentially in a safe transaction block
    await sql.begin(async (sqlTx) => {
      for (const file of pendingFiles) {
        console.log(`⚡ Executing: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sqlQuery = fs.readFileSync(filePath, "utf8");
        
        // Run the raw script migration query
        await sqlTx.unsafe(sqlQuery);

        // Record this file as successfully executed
        await sqlTx`
          INSERT INTO _migrations (file_name) VALUES (${file})
        `;
      }
    });

    console.log("✅ New schema migrations executed and logged successfully!");
  } catch (error) {
    console.error("❌ Migration engine encountered a failure:", error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

runMigration();
