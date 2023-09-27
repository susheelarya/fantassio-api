import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
 
export const dbConnect =  async () => {
 return  await mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    database: "stk11L",
    password:"Fr000glers!",
    multipleStatements: true
  }).then(connect => {
    const client = drizzle(connect);

    return client
  })
}

dbConnect().then(() => console.log("connected"))


 


