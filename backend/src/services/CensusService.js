import axios from 'axios';
import { config } from '../../config.js';

// State abbreviation to FIPS code mapping
const STATE_FIPS = {
    'AL': '01', 'AK': '02', 'AZ': '04', 'AR': '05', 'CA': '06', 'CO': '08', 'CT': '09',
    'DE': '10', 'FL': '12', 'GA': '13', 'HI': '15', 'ID': '16', 'IL': '17', 'IN': '18',
    'IA': '19', 'KS': '20', 'KY': '21', 'LA': '22', 'ME': '23', 'MD': '24', 'MA': '25',
    'MI': '26', 'MN': '27', 'MS': '28', 'MO': '29', 'MT': '30', 'NE': '31', 'NV': '32',
    'NH': '33', 'NJ': '34', 'NM': '35', 'NY': '36', 'NC': '37', 'ND': '38', 'OH': '39',
    'OK': '40', 'OR': '41', 'PA': '42', 'RI': '44', 'SC': '45', 'SD': '46', 'TN': '47',
    'TX': '48', 'UT': '49', 'VT': '50', 'VA': '51', 'WA': '53', 'WV': '54', 'WI': '55',
    'WY': '56', 'DC': '11'
};

class CensusService {
    constructor() {
        this.apiKey = config.census.apiKey;
        this.baseUrl = 'https://api.census.gov/data/2021/acs/acs5';
    }

    async getTownStats(town, state) {
        try {
            // First, get the place FIPS code for the given town
            const geoData = await this.#getGeographicData(town, state);
            
            if (!geoData) {
                return {
                    exists: false,
                    error: 'Could not find geographic data for the specified location'
                };
            }

            // Get ACS 5-year estimates for the place
            const censusStats = await this.#getCensusStats(geoData);
            
            return {
                exists: true,
                representatives: [], // Census doesn't provide representative data
                offices: [], // Census doesn't provide office data
                divisions: [], // Census doesn't provide division data
                censusData: censusStats
            };
        } catch (error) {
            console.error(`Error getting census stats for ${town}, ${state}:`, error);
            return {
                exists: false,
                error: error.message
            };
        }
    }

    async getStatsByLocation(lat, lon) {
        try {
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
            const response = await axios.get(nominatimUrl, {
                headers: { 'User-Agent': 'HousingMap/1.0)' }
            });
            const address = response.data.address;

            const town = address.town || address.city || address.village || address.hamlet;
            const state = address.state;
            if (!town || !state) {
                return { exists: false, error: 'Could not determine town or state from coordinates' };
            }

            return await this.getTownStats(town, state);
        } catch (error) {
            console.error('Error in getStatsByLatLon:', error);
            return { exists: false, error: error.message };
        }
    }

    async #getGeographicData(town, state) {
        try {
            const stateCode = state.toUpperCase();
            const stateFips = STATE_FIPS[stateCode];
            
            if (!stateFips) {
                throw new Error(`Invalid state code: ${state}`);
            }

            const placeResponse = await axios.get(`${this.baseUrl}?get=NAME&for=place:*&in=state:${stateFips}&key=${this.apiKey}`);
            
            if (!placeResponse.data || placeResponse.data.length < 2) {
                throw new Error('Invalid place response from Census API');
            }

            const places = placeResponse.data.slice(1);
            const searchTown = town.toLowerCase();
            
            const place = places.find(p => {
                const placeName = p[0].toLowerCase();
                const baseName = placeName.split(/[,\s]+/)[0];
                return baseName === searchTown;
            });

            if (!place) {
                throw new Error(`Could not find place data for ${town}`);
            }

            return {
                state: stateFips,
                place: place[2] // Place FIPS code
            };
        } catch (error) {
            console.error('Error getting geographic data:', error);
            return null;
        }
    }

    async #getCensusStats(geoData) {
        try {
            const variables = [
                'B01001_001E', // Total population
                'B19013_001E', // Median household income
                'B25077_001E', // Median home value
                'B25003_001E', // Total housing units
                'B25003_002E', // Owner-occupied housing units
                'B25003_003E', // Renter-occupied housing units
                'B25002_001E', // Total occupied housing units
                'B25002_002E', // Occupied housing units
                'B25002_003E'  // Vacant housing units
            ].join(',');

            const url = `${this.baseUrl}?get=${variables}&for=place:${geoData.place}&in=state:${geoData.state}&key=${this.apiKey}`;
            
            const response = await axios.get(url);
            
            if (!response.data || response.data.length < 2) {
                throw new Error('Invalid response from Census API');
            }

            const data = response.data[1];
            const headers = response.data[0];

            const stats = {};
            headers.forEach((header, index) => {
                if (header !== 'state' && header !== 'place') {
                    stats[header] = data[index];
                }
            });

            return {
                population: stats.B01001_001E,
                medianIncome: stats.B19013_001E,
                medianHomeValue: stats.B25077_001E,
                totalHousingUnits: stats.B25003_001E,
                ownerOccupiedUnits: stats.B25003_002E,
                renterOccupiedUnits: stats.B25003_003E,
                occupiedUnits: stats.B25002_002E,
                vacantUnits: stats.B25002_003E
            };
        } catch (error) {
            console.error('Error getting census stats:', error);
            throw error;
        }
    }
}

export default new CensusService();
