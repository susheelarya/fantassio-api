import { drizzle } from 'drizzle-orm/node-mysql2';
import mysql from mysql2/promiseHooks;



const connection = await mysql.createConnection({
  host: "host",
  user: "user",
  database: "database",
  password:"Fr000glers!"
});
 
const db = drizzle(connection);

