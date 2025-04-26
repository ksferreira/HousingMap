import express from 'express';

class FavRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    //change stuf
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