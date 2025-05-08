import axios from 'axios';
import ModelFactory from '../model/ModelFactory.js';
import CensusService from './CensusService.js';
import { normalizeState } from '../util/StateMapping.js';

class TownStatsService {
    constructor() {
        this.initializeModels();
    }

    async initializeModels() {
        try {
            this.townStatsModel = await ModelFactory.getModel();
        } catch (error) {
            console.error('Error initializing models for TownStatsService: ', error);
        }
    }

    /**
     * Retrieves base statistics for a given town and state. Attempts to fetch cached data from the database; if data is missing or needs refresh, fetches fresh data from external sources and updates the cache.
     *
     * @param {string} town - The name of the town to retrieve statistics for.
     * @param {string} state - The full name or abbreviation of the state the town is located in.
     * @returns {Promise<Object>} An object containing base statistics for the town and state, including representatives, offices, divisions, and census data. If an error occurs, returns an object with 'exists: false' and an 'error' message.
     *
     * The returned object structure:
     *   {
     *     normalizedTown: string,
     *     normalizedState: string,
     *     representatives: Array,
     *     offices: Array,
     *     divisions: Array,
     *     censusData: Object,
     *     exists: boolean,
     *     error?: string
     *   }
     *
     * If the data is not found or an error occurs, 'exists' will be false and 'error' will contain the error message.
     */
    async getBaseStats(town, state) {
        const normalizedTown = town.trim().toLowerCase();
        const normalizedState = normalizeState(state);

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

    async getBaseStatsByLatLon(lat, lon) {
        try {
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
            const response = await axios.get(nominatimUrl, {
                headers: { 'User-Agent': 'HousingMap/1.0' }
            });
            const address = response.data.address;
            const town = address.town || address.city || address.village || address.hamlet;
            const state = address.state;
            if (!town || !state) {
                return { exists: false, error: 'Could not determine town or state from coordinates', address };
            }

            return await this.getBaseStats(town, state);
        } catch (error) {
            console.error('Error in getBaseStatsByLatLon:', error);
            return { exists: false, error: error.message };
        }
    }
    
    async #fetchFreshStats(town, state) {
        console.log(`Fetching fresh data for ${town}, ${state}`);
        return await CensusService.getTownStats(town, state);
    }
}

export default new TownStatsService();