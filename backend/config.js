import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');  

dotenv.config({
    path: join(rootDir, '/backend/.env')
});

if (!fs.existsSync(join(rootDir, '/backend/.env'))) {
    console.log(join(rootDir, '/backend/.env'));
    throw new Error('No .env file found. Please create one based on the README.md instructions.');
}

export const config = {
    googleCivics: {
        apiKey: process.env.GOOGLE_CIVICS_API_KEY,
    },
    census: {
        apiKey: process.env.CENSUS_API_KEY,
    },
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
    }
}