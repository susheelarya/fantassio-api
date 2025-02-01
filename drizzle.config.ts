import type { Config } from 'drizzle-kit';

require('dotenv').config();

// export default {
//   schema: './src/db/schema',
//   out: './drizzle',
//   driver: 'mysql2',
//   dbCredentials: {
//     connectionString: `${process.env.DRIZZLE_DATABASE_URL!}?sslmode=require`,
//   },
// } satisfies Config;


export default {
  schema: './drizzle/new_schema',
  //./src/db/schema',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    //connectionString: "postgresql://devang:password!@localhost:3306/fantassio",
    host: 'localhost',
    port: 5432,
    user: 'devang',
    password: 'password',
    database: 'fantassio'
  }
} satisfies Config;
