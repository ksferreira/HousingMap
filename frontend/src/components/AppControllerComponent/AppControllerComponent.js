import { EventHub } from '../../events/EventHub.js';
import { MapComponent } from '../MapComponent/MapComponent.js';

export class AppControllerComponent {
    #container = null;
    #mapComponent = null;
    #hub = null;
    constructor() {
        this.#hub = EventHub.getInstance();
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        this.#mapComponent = new MapComponent();
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
        this.#container.setAttribute('class', 'app-controller-container');
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
            <div class="hero">
                <h1>Housing Map</h1>
                <p>Find your perfect home with ease</p>
                <button class="btn">Launch Map</button>
            </div>
        `;
    }

    #attachEventListeners() {
        this.#hub.subscribe('LaunchMap', taskData => {
            this.#launchMap();
        });

        const launchMapButton = this.#container.querySelector('.btn');
        launchMapButton.addEventListener('click', () => {
            this.#hub.publish('LaunchMap', {});
        });
    }

    #launchMap() {
        console.log('Launching map');

        // Clear the container
        this.#container.innerHTML = '';
        
        // Add the map view class to the container
        this.#container.classList.add('map-view');
        
        // Append the map component
        const mapElement = this.#mapComponent.render();
        this.#container.appendChild(mapElement);
        
        // Force a resize after a short delay to ensure Leaflet initializes properly
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    }
}