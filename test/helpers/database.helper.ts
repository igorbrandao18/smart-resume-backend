import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

export const getDatabaseConfig = () => {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
      synchronize: true,
      ssl: configService.get('DB_SSL') ? {
        rejectUnauthorized: false
      } : false,
    }),
    inject: [ConfigService],
  });
}; 