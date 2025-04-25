import express from 'express';

class StatRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/base-stats', async (req, res) => {
            const stats = await StatsController.getBaseStats();
        });
    }
    
    getRouter() {
        return this.router;
    }
}

export default new StatRoutes().getRouter();