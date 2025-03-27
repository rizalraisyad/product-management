import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbConfig } from './db-config';
import { appConfig, AppConfig } from './app-config';

export interface AllConfig {
  app: AppConfig;
  db: TypeOrmModuleOptions;
}

export function allConfig(): AllConfig {
  return {
    app: appConfig(),
    db: dbConfig(),
  };
}
