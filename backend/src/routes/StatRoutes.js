import express from 'express';
import StatsController from '../controller/StatsController.js';

class StatRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/base-stats', async (req, res) => {
            try {
                await StatsController.getBaseStats(req, res);
            } catch (error) {
                console.error('Error fetching base stats: ', error);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'An error occurred while fetching stats' });
                }
            }
        });
    }
    
    getRouter() {
        return this.router;
    }
}

export default new StatRoutes().getRouter();