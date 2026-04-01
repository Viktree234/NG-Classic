import { Pool } from 'pg';

const globalForDb = globalThis;
let pool = globalForDb.__ngClassicPool ?? null;

function getConnectionString() {
  const value = process.env.DATABASE_URL || process.env.AIVEN_DATABASE_URL;
  if (!value) {
    throw new Error('DATABASE_URL or AIVEN_DATABASE_URL is required.');
  }

  const url = new URL(value);
  url.searchParams.delete('sslmode');
  url.searchParams.delete('sslcert');
  url.searchParams.delete('sslkey');
  url.searchParams.delete('sslrootcert');
  return url.toString();
}

function getSslConfig() {
  if (process.env.DATABASE_SSL === 'false') {
    return false;
  }

  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, '\n');
  return {
    ...(ca ? { ca } : {}),
    rejectUnauthorized: false,
  };
}

function getPool() {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: getConnectionString(),
    ssl: getSslConfig(),
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.__ngClassicPool = pool;
  }

  return pool;
}

export async function query(text, params = []) {
  const result = await getPool().query(text, params);
  return result.rows;
}

export async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0] ?? null;
}
