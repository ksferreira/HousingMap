import axios from 'axios';
import ModelFactory from '../model/ModelFactory.js';
import CensusService from './CensusService.js';

class TownStatsService {
    constructor() {
        this.initializeModels();
    }

    async initializeModels() {
        try {
            this.townStatsModel = await ModelFactory.getTownStatsModel();
        } catch (error) {
            console.error('Error initializing models for TownStatsService: ', error);
        }
    }

    async getBaseStats(town, state) {
        const normalizedTown = town.trim().toLowerCase();
        const normalizedState = state.trim().toUpperCase();

        try {
            if (!this.townStatsModel) await this.initializeModels();

            const stats = await this.townStatsModel.getBaseStats(normalizedTown, normalizedState);

            if (!stats.exists || stats.needsRefresh) {
                const freshStats = await this.#fetchFreshStats(normalizedTown, normalizedState);
                
                if (freshStats.exists && !freshStats.error) {
                    await this.townStatsModel.saveStats(
                        normalizedTown, 
                        normalizedState, 
                        {
                            representatives: freshStats.representatives,
                            offices: freshStats.offices,
                            divisions: freshStats.divisions,
                            censusData: freshStats.censusData
                        }
                    );
                }
                
                return {normalizedTown, normalizedState, ...freshStats};
            }

            return stats;
        } catch (error) {
            console.error(`Error getting base stats for ${town}, ${state}:`, error);
            return {
                exists: false,
                error: error.message
            };
        }
    }

    async #fetchFreshStats(town, state) {
        console.log(`Fetching fresh data for ${town}, ${state}`);
        return await CensusService.getTownStats(town, state);
    }
}

export default new TownStatsService();