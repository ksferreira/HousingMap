import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
});


const TownStats = sequelize.define('town_stats', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('data');
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue('data', JSON.stringify(value));
        }
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['town', 'state']
        }
    ]
});

class _TownStatsModel {
    constructor() {
        this.initialized = false;
    }

    async init(forceReset = false) {
        try {
            await sequelize.authenticate();
            await TownStats.sync({ force: forceReset });
            this.initialized = true;
            console.log('TownStats model initialized successfully');
        } catch (error) {
            console.error('Unable to initialize TownStats model:', error);
            throw error;
        }
    }

    async getBaseStats(town, state) {
        try {
            if (!this.initialized) {
                await this.init();
            }

            // Check if we have stats for this town
            const result = await TownStats.findOne({
                where: {
                    town: town,
                    state: state
                }
            });

            if (!result) {
                return { exists: false };
            }

  
            const lastUpdated = new Date(result.last_updated);
            const now = new Date();
            const daysDiff = (now - lastUpdated) / (1000 * 60 * 60 * 24);
            
            if (daysDiff > 7) {
                return { 
                    exists: true, 
                    needsRefresh: true,
                    town: result.town,
                    state: result.state,
                    ...result.data
                };
            }

            return { 
                exists: true, 
                needsRefresh: false,
                town: result.town,
                state: result.state,
                ...result.data
            };
        } catch (error) {
            console.error(`Error getting base stats for ${town}, ${state}:`, error);
            return { exists: false, error: error.message };
        }
    }

    async saveStats(town, state, data) {
        try {
            if (!this.initialized) {
                await this.init();
            }
            
            await TownStats.upsert({
                town: town,
                state: state,
                data: data,
                last_updated: new Date()
            });

            return true;
        } catch (error) {
            console.error(`Error saving stats for ${town}, ${state}:`, error);
            return false;
        }
    }
}

const TownStatsModel = new _TownStatsModel();

export default TownStatsModel;
