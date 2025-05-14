import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from './schema';

export const DRIZZLE = 'DRIZZLE';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          user: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
        });
        return drizzle(pool, { schema }); 
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
