import express from 'express';

class FavRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/favs', async (req, res) => {
            const favs = await FavController.getAllFavs();
        });
        this.router.get('/remove-favs', async (req, res) => {
            const removeFav = await FavController.clearFavs();
        });
        this.router.get('/add-fav', async (req, res) => {
            const addFav = await FavController.addFav();
        });
    }
    
    getRouter() {
        return this.router;
    }
}

export default new FavRoutes().getRouter();
