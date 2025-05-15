// drizzle.config.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema/**/*.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    ssl: {
      rejectUnauthorized: false, 
    },
  },
});
