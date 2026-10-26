import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(env.MONGO_URI, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[Database] Connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt === retries) {
        console.error('[Database] Could not establish MongoDB connection. Exiting...');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection lost');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected');
});
