import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(DATABASE_URL);

export const connectDB = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    return result ? true : false;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

export default sql;