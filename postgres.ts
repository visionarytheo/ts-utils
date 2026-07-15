import postgres from "postgres";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL is not defined in your environment variables",
  );
}

const isLocal =
  DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1");

export const sql = postgres(DATABASE_URL, {
  ssl: isLocal ? false : "require",
  max: 10,
  idle_timeout: 30,
});

