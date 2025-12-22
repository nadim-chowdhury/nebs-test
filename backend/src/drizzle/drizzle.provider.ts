import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DRIZZLE_ORM = 'DRIZZLE_ORM';

export const drizzleProvider = {
  provide: DRIZZLE_ORM,
  useFactory: async () => {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString,
    });

    return drizzle(pool, { schema });
  },
};
