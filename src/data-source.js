const path = require('path');
const { DataSource } = require('typeorm');

require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'app.sqlite');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  entities: [path.join(__dirname, 'entities', '*.js')],
  migrations: [path.join(__dirname, 'migrations', '*.js')],
  logging: false,
  synchronize: false
});

module.exports = {
  AppDataSource
};

