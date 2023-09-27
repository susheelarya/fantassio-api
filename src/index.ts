import app from './app';
import { dbConnect } from './db/dbConnect'

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  await dbConnect();
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
