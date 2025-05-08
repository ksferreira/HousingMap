import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../events/EventHub.js";
import { Events } from "../../events/Events.js";
/***
 *  Sample response from the API:
 * {
    "normalizedTown": "dover", 
    "normalizedState": "MA",
    "exists": true,
    "representatives": [],
    "offices": [],
    "divisions": [],
    "censusData": {
        "population": "2413",
        "medianIncome": "227375",
        "medianHomeValue": "1020700",
        "totalHousingUnits": "767",
        "ownerOccupiedUnits": "722",
        "renterOccupiedUnits": "45",
        "occupiedUnits": "767",
        "vacantUnits": "0"
    }
}
 * 
 */


export class SidebarComponent extends BaseComponent {
    #container = null;
    #position = null;
    #data = null;
    #hub = null;

    constructor(position, data = {}) {
        super();
        this.#position = position;
        this.#hub = EventHub.getInstance();
    }
    
    render() {
        if (this.#container) return this.#container;

        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.setAttribute('class', 'sidebar');
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
            <div class="sidebar-header" style="display: flex; justify-content: space-between;">
                <h2>Location Details</h2>
                <button class="fav" id="favbutton">Favorite</button>
            </div>
            <div class="sidebar-content">
                <div class="info-card">
                    <h3 id="city-county">Selected Area</h3>
                    <p>No area selected</p>
                </div>
        `;
    }

    #attachEventListeners() {
        this.#hub.subscribe(Events.SearchLocationSuccess, (data) => {
            this.#data = data;
            console.log(data);

            const cityCounty = this.#container.querySelector('#city-county');
            const infoCard = this.#container.querySelector('.info-card p');

            const townRaw = data.normalizedTown || data.town || 'Unknown';
            const stateRaw = data.normalizedState || data.state || 'Unknown';
            const town = townRaw.charAt(0).toUpperCase() + townRaw.slice(1);

            cityCounty.textContent = `${town}, ${stateRaw}`;

            const census = data.censusData || {};
            infoCard.innerHTML = `
                <strong>Population:</strong> ${census.population || 'N/A'}<br>
                <strong>Median Income:</strong> $${census.medianIncome || 'N/A'}<br>
                <strong>Median Home Value:</strong> $${census.medianHomeValue || 'N/A'}<br>
                <strong>Total Housing Units:</strong> ${census.totalHousingUnits || 'N/A'}<br>
                <strong>Owner-Occupied Units:</strong> ${census.ownerOccupiedUnits || 'N/A'}<br>
                <strong>Renter-Occupied Units:</strong> ${census.renterOccupiedUnits || 'N/A'}<br>
                <strong>Occupied Units:</strong> ${census.occupiedUnits || 'N/A'}<br>
                <strong>Vacant Units:</strong> ${census.vacantUnits || 'N/A'}<br>
            `;
        });
        this.#hub.subscribe(Events.SearchLocationError, (data) => {
            this.#data = data;
        });
    }
}