import InMemoryTaskModel from "./InMemoryTaskModel.js";
import SQLiteTaskModel from "./SQLiteTaskModel.js";
import TownStatsModel from "./TownStatsModel.js";

class _ModelFactory {
  async getModel(model = "sqlite") {
    if (model === "sqlite") {
      return SQLiteTaskModel;
    } else if (model === "sqlite-fresh") {
      await SQLiteTaskModel.init(true);
      return SQLiteTaskModel;
    } else {
      return InMemoryTaskModel;
    }
  }

  async getTownStatsModel() {
    try {
      await TownStatsModel.init();
      return TownStatsModel;
    } catch (error) {
      console.error("Error initializing TownStatsModel:", error);
      throw error;
    }
  }
}

const ModelFactory = new _ModelFactory();
export default ModelFactory; 