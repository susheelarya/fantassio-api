import { dbConnect } from './src/db/dbConnect';
import { migrate } from 'drizzle-orm/mysql2/migrator';

require('dotenv').config();

const migrateDB = async () => {
  try {
    const db = await dbConnect();

    if (!db) {
      console.log('Cannot migrate files');
    } else {
      await migrate(db, { migrationsFolder: './drizzle' });
    }
    // this will automatically run needed migrations on the database
  } catch (error) {
    console.log(error, 'error_migrating');
  }
};

migrateDB().then(() => {
  console.log('Migration complete');
  process.exit();
});
