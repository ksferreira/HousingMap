class StatsController {
    static async getBaseStats() {
        const stats = await ModelFactory.getStats();
        return stats;
    }
}
