import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import configuration from './configuration';

const config = configuration();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true, // Apenas para desenvolvimento
  logging: true,
  ssl: config.database.ssl ? {
    rejectUnauthorized: false
  } : false,
}); 