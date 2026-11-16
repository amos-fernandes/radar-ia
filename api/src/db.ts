import pg from 'pg';
import { config } from './config.js';

const pool = new pg.Pool({ connectionString: config.databaseUrl });

export async function query<T = any>(text: string, params?: any[]) {
  return pool.query<T>(text, params);
}

export async function healthCheck() {
  const r = await query('SELECT 1 as ok');
  return r.rows[0]?.ok === 1;
}

export { pool };
