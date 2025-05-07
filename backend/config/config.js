import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');


dotenv.config({ path: join(rootDir, '.env') });

// Check if .env file exists, if not, provide instructions
if (!fs.existsSync(join(rootDir, '.env'))) {
  console.warn('\x1b[33m%s\x1b[0m', 
    'Warning: .env file not found in the project root directory. ' +
    'Please create a .env file with your API keys:\n' +
    'CENSUS_API_KEY=your_api_key_here');
}

export default {
  // Census API configuration
  census: {
    apiKey: process.env.CENSUS_API_KEY || '',
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // Database configuration
  database: {
    path: join(rootDir, 'database.sqlite'),
  }
}; 