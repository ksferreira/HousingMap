import express from 'express';

class Server {
    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.setupRoutes();
    }

    configureMiddleware() {
        this.app.use(express.static(''))
        this.app.use(express.json({ limit: '10mb' }));
    }

    setupRoutes() {
        this.app.use('/v1', );
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