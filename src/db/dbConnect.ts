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
                connectionString: "postgresql://neondb_owner:npg_cYfvxB4Vqm5T@ep-icy-tooth-a1ag3a2l-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
                //process.env.DRIZZLE_DATABASE_URL!,
                // user: 'devang',
                // host: 'localhost',
                // database: 'fantassio',
                // password: 'password',
                // port: 5432
                //parseInt(<string>process.env.PGPORT, 10)
                // ssl: {
                //   rejectUnauthorized: false,
                // },
              });
      const client = await pool.connect();

      const db = drizzle(client);
      drizzleDb = db;

      console.log('Connected to DB');

      return db;
    } catch (error) {
      console.log(error)
      throw new Error('Error connecting to DB');
    }
  }
};
 
// export const dbConnect =  async () => {
//  return  await mysql.createConnection({
//     port: 3306,
//     PGUSER=devang
// PGHOST=localhost
// PGPASSWORD=password
// PGDATABASE=hichers

//     host: "localhost",
//     user: "root",
//     database: "stk11L",
//     password:"Fr000glers!",
//     multipleStatements: true
//   }).then(connect => {
//     const client = drizzle(connect);

//     return client
//   })
// }

// dbConnect().then(() => console.log("connected"))


 


