import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Supabase URL or local DB URL
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully to Supabase');
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err.stack);
  }
}

// Ensure the db functions are async and wrapper for PG

// Helper: converts SQLite '?' to PG '$n'
function convertSql(sql) {
  let count = 1;
  return sql.replace(/\?/g, () => `$${count++}`);
}

export async function dbAll(sql, params = []) {
  const pgSql = convertSql(sql);
  const result = await pool.query(pgSql, params);
  return result.rows;
}

export async function dbGet(sql, params = []) {
  const pgSql = convertSql(sql);
  const result = await pool.query(pgSql, params);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function dbRun(sql, params = []) {
  let pgSql = convertSql(sql);

  // Auto-append RETURNING id for lastInsertRowid compatibility with typical inserts
  if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
    pgSql += ' RETURNING id';
  }

  const result = await pool.query(pgSql, params);

  // Mimic sqlite db.run() which returned an object with lastInsertRowid
  let lastId = null;
  if (result.command === 'INSERT' && result.rows.length > 0) {
    lastId = result.rows[0].id;
  }
  
  return { lastInsertRowid: lastId };
}
