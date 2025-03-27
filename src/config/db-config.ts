import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface partialDbConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  url?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

function buildConnection(): partialDbConfig {
  const sslEnabled = process.env.DB_SSL?.toLowerCase() === 'true';

  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    };
  }

  const dbHost = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 5432;
  const username = process.env.DB_USER || 'dbtesting';
  const password = process.env.DB_PASSWORD || 'dbtesting';
  const database = process.env.DB_NAME || 'klontong';

  return {
    host: dbHost,
    port: port,
    username: username,
    password: password,
    database: database,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  };
}

export function dbConfig(): TypeOrmModuleOptions {
  const dbType =
    (process.env.DB_TYPE as PostgresConnectionOptions['type']) || 'postgres';
  const partialDbConfig = buildConnection();

  return {
    ...partialDbConfig,
    type: dbType,
    logging: process.env.DB_LOGGING?.toLowerCase() === 'true',
    synchronize: process.env.DB_SYNCHRONIZE?.toLowerCase() === 'true',
    dropSchema: process.env.DB_DROP_SCHEMA?.toLowerCase() === 'true',
    migrationsRun: process.env.DB_MIGRATION_RUN?.toLowerCase() === 'true',
    entities: [__dirname + '/../domains/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
  };
}

export function dataSourceConfig(): DataSourceOptions {
  const sslEnabled = process.env.DB_SSL?.toLowerCase() === 'true';

  const dbType: PostgresConnectionOptions['type'] = 'postgres';

  const connection = process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'dbtesting',
        password: process.env.DB_PASSWORD || 'dbtesting',
        database: process.env.DB_NAME || 'klontong',
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      };

  return {
    type: dbType,
    ...connection,
    logging: process.env.DB_LOGGING === 'true',
    synchronize: false,
    migrations: ['src/db/migrations/**/*{.ts,.js}'],
    entities: ['src/domains/**/*.entity{.ts,.js}'],
  };
}
