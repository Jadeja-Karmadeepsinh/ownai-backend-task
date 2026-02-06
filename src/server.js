const fs = require('fs');
const path = require('path');
const app = require('./app');
const { AppDataSource } = require('./data-source');

require('dotenv').config();

const port = process.env.PORT || 3000;

// Ensure data directory exists for SQLite file
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.sqlite');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize data source', err);
    process.exit(1);
  });

