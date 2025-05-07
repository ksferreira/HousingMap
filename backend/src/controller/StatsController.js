
import TownStatsService from "../services/TownStatsService.js";

class StatsController {
    async getBaseStats(req, res) {
        try {
            const { town, state } = req.query;

            if (!town || !state) return res.status(400).json({ error: 'Missing parameters', message: 'Town and state are required' });

            const baseStats = await TownStatsService.getBaseStats(town, state);

            return res.json(baseStats);

        } catch (error) {
            return res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    }
}

export default new StatsController();