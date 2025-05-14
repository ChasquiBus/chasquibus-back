import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default {
  schema: './src/drizzle/schema/**/*.ts',
  out: './src/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
  },
} as const;
