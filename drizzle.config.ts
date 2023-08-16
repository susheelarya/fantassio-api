import type { Config } from 'drizzle-kit';

require('dotenv').config();

export default {
  schema: './src/db/schema',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: `${process.env.DRIZZLE_DATABASE_URL!}?sslmode=require`,
  },
} satisfies Config;
