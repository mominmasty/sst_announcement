import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { validateEnv } from './env';
import * as schema from '../schema';

interface GlobalDb {
  pool?: Pool;
  db?: NodePgDatabase<typeof schema>;
}

const globalForDb = globalThis as unknown as GlobalDb;

export function getPool(): Pool {
  if (globalForDb.pool) {
    return globalForDb.pool;
  }

  const env = validateEnv();

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.DATABASE_URL?.includes('localhost') ? undefined : { rejectUnauthorized: false },
  });

  globalForDb.pool = pool;
  return pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (globalForDb.db) {
    return globalForDb.db;
  }

  const pool = getPool();
  const db = drizzle(pool, { schema });
  globalForDb.db = db;
  return db;
}

export async function verifyConnection(): Promise<void> {
  const pool = getPool();
  await pool.query('SELECT 1');
}
