// lib/pg.ts
import { Pool } from 'pg';

// Core connection engine using your environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Max number of concurrent active connections allowed
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if a connection takes over 2 seconds
});

// Helper function to run a raw query simply
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Helper function for heavy multi-statement SQL transactions
export const getTransactionClient = () => {
  return pool.connect();
};
