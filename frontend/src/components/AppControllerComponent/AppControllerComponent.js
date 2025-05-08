import { EventHub } from '../../events/EventHub.js';
import { MapComponent } from '../MapComponent/MapComponent.js';
import { SidebarComponent } from '../SidebarComponent/SidebarComponent.js';
export class AppControllerComponent {
    #container = null;
    #mapComponent = null;
    #hub = null;

    #sidebarLeftComponent = null;
    #sidebarRightComponent = null;

    constructor() {
        this.#hub = EventHub.getInstance();
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        this.#mapComponent = new MapComponent();
        this.#sidebarLeftComponent = new SidebarComponent({
            position: 'left',
            data: null
        });
        this.#sidebarRightComponent = new SidebarComponent({
            position: 'right',
            data: null
        });
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

        this.#container.innerHTML = '';
        this.#container.className = '';
        this.#container.classList.add('dashboard-container');
        this.#container.classList.add('map-view');

        // Left sidebar
        const sidebarLeftElement = this.#sidebarLeftComponent.render();
        this.#container.appendChild(sidebarLeftElement);

        // Map container
        const mapContainer = document.createElement('main');
        mapContainer.className = 'map-container';
        const mapElement = this.#mapComponent.render();
        mapContainer.appendChild(mapElement);
        this.#container.appendChild(mapContainer);

        // // Right sidebar
        // const sidebarRightElement = this.#sidebarRightComponent.render();
        // this.#container.appendChild(sidebarRightElement);

        // Force a resize after a short delay to ensure Leaflet initializes properly
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    }
}