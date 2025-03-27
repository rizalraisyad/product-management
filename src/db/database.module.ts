import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        ...cs.get<TypeOrmModuleOptions>('db'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
