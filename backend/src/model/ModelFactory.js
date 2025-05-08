import TownStatsModel from "./TownStatsModel.js";

class _ModelFactory {
  async getModel() {
    try {
      await TownStatsModel.init();
      return TownStatsModel;
    } catch (error) {
      console.error('Error initializing TownStatsModel:', error);
      throw error;
    }
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory;
