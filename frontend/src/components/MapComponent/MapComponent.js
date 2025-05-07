import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export class MapComponent extends BaseComponent {
    #container = null;
    #map = null;
    #suggestionsContainer = null;

    constructor() {
        super();
    }

    render() {
        if (this.#container) return this.#container;

        this.#createContainer();
        this.#setupContainerContent();
        
        this.#waitForElementAndInitialize();
        
        return this.#container;
    }

    #waitForElementAndInitialize() {
        // Check if the map element is in the DOM
        const checkForElement = () => {
            const mapElement = document.getElementById('map');
            if (mapElement) {
                // Initialize the map after a short delay to ensure the element is fully rendered
                setTimeout(() => {
                    this.#initializeMap();
                    this.#attachEventListeners();
                    this.#setupSearch();
                }, 100);
            } else {
                // Try again in a short while
                setTimeout(checkForElement, 50);
            }
        };
        
        // Start checking
        setTimeout(checkForElement, 0);
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('map-container');
        this.#container.setAttribute('id', 'map-container');
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
            <div id="map" class="leaflet-map"></div>
        `;
    }

    #initializeMap() {
        if (document.getElementById('map')) {
            // Make sure any existing map instance is cleaned up
            if (this.#map) {
                this.#map.remove();
            }
            
            this.#map = L.map('map').setView([40.7128, -74.0060], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            // Force a resize event to ensure the map renders correctly
            setTimeout(() => {
                this.#map.invalidateSize();
            }, 100);
        } else {
            console.error('Map element not found');
        }
    }

    #setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) {
            console.error('Search input not found');
            return;
        }

        this.#suggestionsContainer = document.createElement('div');
        this.#suggestionsContainer.className = 'search-suggestions';
        searchInput.parentNode.appendChild(this.#suggestionsContainer);

        let timeout;
        const favorite = document.querySelector(".fav");
        if (favorite) {
            favorite.addEventListener('click', this.#handleFavoriteClick.bind(this));
        }

        searchInput.addEventListener('input', this.#handleSearchInput.bind(this));
    }

    #handleFavoriteClick() {
        if(document.querySelector('.info-card:first-child p').textContent !== "No area selected"){
            //let newFave = document.querySelector('.info-card:first-child p').textContent.slice(47, 111).split(", ");
            let newFave = document.querySelector('.info-card:first-child p').textContent.slice(47, 
                document.querySelector('.info-card:first-child p').textContent.indexOf("\n", 47));

            if(localStorage.getItem("total")){
                let total = parseInt(localStorage.getItem("total"))
                localStorage.setItem("total", ++total)
            }else{
                localStorage.setItem("total", 1)
            }
            localStorage.setItem(JSON.parse(localStorage.getItem("total")), newFave);
        }
    }

    async #handleSearchInput(event) {
        const input = event.target;
        
        if (this.timeout) clearTimeout(this.timeout);

        const query = input.value;
        if (query.length < 2) {
            this.#suggestionsContainer.style.display = 'none';
            return;
        }

        this.timeout = setTimeout(async () => {
            try {   
                const suggestions = await this.#searchLocation(query);
                this.#suggestionsContainer.innerHTML = '';
                
                if (suggestions.length > 0) {
                    this.#suggestionsContainer.style.display = 'block';

                    suggestions.forEach(result => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.textContent = result.display_name;
                        div.addEventListener('click', async () => {
                            input.value = result.display_name;
                            this.#suggestionsContainer.style.display = 'none';

                            const latlng = [parseFloat(result.lat), parseFloat(result.lon)];
                            
              
                            
                            try {
                                const response = await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${result.osm_type[0].toUpperCase()}${result.osm_id}&format=geojson&polygon_geojson=1&admin_level=8`);
                                const geojsonData = await response.json();
                                
                                const selectedAreaCard = document.querySelector('.info-card:first-child p');
                                if (selectedAreaCard) {
                                    selectedAreaCard.innerHTML = `
                                        <strong>Location:</strong> ${result.display_name}<br>
                                    `;
                                }

                                if (window.geojsonLayer) {
                                    this.#map.removeLayer(window.geojsonLayer);
                                }
                                window.geojsonLayer = L.geoJSON(geojsonData, {
                                    style: function(feature) {
                                        return {
                                            color: '#3388ff',
                                            weight: 2,
                                            opacity: 1,
                                            fillOpacity: 0.2,
                                            fillColor: '#3388ff'
                                        };
                                    },
                                    onEachFeature: function(feature, layer) {
                                        if (feature.properties && feature.properties.name) {
                                            layer.bindPopup(feature.properties.name);
                                        }
                                    }
                                }).addTo(this.#map);

                                this.#map.fitBounds(window.geojsonLayer.getBounds());
                            } catch (error) {
                                console.error('Error fetching GeoJSON:', error);
                            }
                        });

                        this.#suggestionsContainer.appendChild(div);
                    });
                } else {
                    this.#suggestionsContainer.innerHTML = '<div class="no-results">No results found</div>';
                }
            } catch (error) {
                console.error('Error searching location:', error);
            }
        }, 300);
    }

    async #searchLocation(query) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&featuretype=city&limit=1`);
        const data = await response.json();
        return data;
    }

    #attachEventListeners() {
        // Ensure the map is redrawn when the window resizes
        window.addEventListener('resize', () => {
            if (this.#map) {
                this.#map.invalidateSize();
            }
        });
    }
} 
