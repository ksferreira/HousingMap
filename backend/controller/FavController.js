
import ModelFactory from "../model/ModelFactory.js";

class FavController {
    constructor() {
        ModelFactory.getModel().then((model) => {
          this.model = model;
      });
     }

    async getAllFavs() {
        const favs = await this.model.read();
        res.json(favs);
    }
    async addFav(req, res) {
        try {    
          const fav = await this.model.create(req.body);

          return res.status(201).json(fav);
        } catch (error) {
          console.error("Error:", error);
          return res
            .status(500)
        }
      }
    
      // Clear all tasks
      async clearFavs(req, res) {
        await this.model.delete();
        res.json(await this.model.read());
      }
    }
    

export default new TaskController();