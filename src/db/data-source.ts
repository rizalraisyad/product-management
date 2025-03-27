import { DataSource, DataSourceOptions } from 'typeorm';

const currentEnv = process.env.NODE_ENV || 'development';
// eslint-disable-next-line
require("dotenv").config({ path: `.env.${currentEnv}` });

interface DB {
  url: string;
  type: string;
  entities: string[];
  synchronize: boolean;
  ssl: boolean | { rejectUnauthorized: boolean };
}

function buildConnectionUrl(dbType: string): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const dbHost = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 5432;
  const username = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || 'root';
  const database = process.env.DB_NAME;

  return `${dbType}://${username}:${password}@${dbHost}:${port}/${database}`;
}

function dbConfig(): DB {
  const dbType = (process.env.DB_TYPE as 'postgres') || 'postgres';
  return {
    url: buildConnectionUrl(dbType),
    type: dbType,
    entities: [__dirname + '/../domains/**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE?.toLowerCase() === 'true',
    ssl:
      process.env.DB_SSL?.toLowerCase() === 'false'
        ? false
        : {
            rejectUnauthorized: false,
          },
  };
}

const cfg = dbConfig();

export const AppDataSource = new DataSource({
  ...cfg,
  entities: [__dirname + '/../domains/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  logging: process.env.DB_LOGGING || false,
} as DataSourceOptions);
