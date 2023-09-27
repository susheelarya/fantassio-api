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
  schema: './src/db/schema',
  out: './drizzle',
  driver: 'mysql2',
  // dbCredentials: {
  //   connectionString: "root:Fr000glers!@localhost:3306/stk11L"
  // }
  dbCredentials: {
    port: 3306,
    host: "localhost",
    user: "root",
    database: "stk11L",
    password:"Fr000glers!",
    ssl: true,
  }
} satisfies Config;
