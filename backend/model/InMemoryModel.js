class _InMemoryModel {
    constructor() {
        this.stats = {};
        this.favs = [];
    }
    async create(fav) {
        this.favs.push(fav);
        return fav;
      }
    
      async read() {
        return this.favs;
      }
    
      async delete(fav = null) {
        if (fav === null) {
          this.favs = [];
          return;
        }

      }
    }
    
    // Create a singleton instance of the InMemoryModel.
    const InMemoryModel = new _InMemoryModel();
    
    export default InMemoryTaskModel;
    
    
