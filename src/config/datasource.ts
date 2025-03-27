import { DataSource } from 'typeorm/data-source/DataSource';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'dbtesting',
  password: process.env.DB_PASSWORD || 'dbtesting',
  database: process.env.DB_NAME || 'klontong',
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/db/migrations/**/*.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
