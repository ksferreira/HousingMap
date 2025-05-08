
import TownStatsService from "../services/TownStatsService.js";

class StatsController {
    async getBaseStats(req, res) {
        try {
            const { town, state, lat, lon } = req.query;
            let baseStats = null;

            if ((!town || !state) && (!lat || !lon)) return res.status(400).json({ 
                error: 'Missing parameters', 
                message: 'Town and state or latitude and longitude are required' 
            });

            if (lat && lon) {
                baseStats = await TownStatsService.getBaseStatsByLatLon(lat, lon);
            } else if (town && state) {
                baseStats = await TownStatsService.getBaseStats(town, state);
            } else {
                return res.status(400).json({ 
                    error: 'Missing parameters', 
                    message: 'Provided both latitude and longitude or town and state must be provided.' 
                });
            }

            return res.json(baseStats);

        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }
}

export default new StatsController();