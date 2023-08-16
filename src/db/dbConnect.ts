import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let isConnected = false;
let drizzleDb: NodePgDatabase<Record<string, never>>;

export const dbConnect = async () => {
  if (isConnected && drizzleDb) {
    return drizzleDb;
  } else {
    try {
      const pool = new Pool({
        connectionString: process.env.DRIZZLE_DATABASE_URL!,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      const client = await pool.connect();

      const db = drizzle(client);
      drizzleDb = db;

      console.log('Connected to DB');

      return db;
    } catch (error) {
      throw new Error('Error connecting to DB');
    }
  }
};
