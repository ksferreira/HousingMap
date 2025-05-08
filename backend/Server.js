import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import StatRoutes from './src/routes/StatRoutes.js';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

class Server {
    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.setupRoutes();
    }

    configureMiddleware() {
        this.app.use(express.static(join(rootDir, 'frontend/dist')))
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(cors({origin: 'http://localhost:8080'})); // Dev server
    }

    setupRoutes() {
        this.app.use('/v1', StatRoutes);
        
        // fallback route
        this.app.get('*', (req, res) => {
            res.sendFile(join(rootDir, 'frontend/dist/index.html'));
        });
    }

    start(port = 3000) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}


console.log("Starting server...");
const server = new Server();
server.start();