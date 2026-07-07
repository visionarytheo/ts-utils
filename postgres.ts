// lib/pg.ts
import postgres from 'postgres';

// Initialize the single pooler wrapper globally
const sql = postgres(process.env.DATABASE_URL!, { 
  ssl: 'require',
  max: 10, // Restrict connection bounds safely for serverless runtimes
  idle_timeout: 30 // Kill idle connections after 30 seconds
});

export default sql;
