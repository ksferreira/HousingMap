import { EventHub } from '../../events/EventHub.js';
import { MapComponent } from '../MapComponent/MapComponent.js';
import { SidebarComponent } from '../SidebarComponent/SidebarComponent.js';
import { ListComponent } from '../ListComponent/ListComponent.js';
import { AboutComponent } from '../AboutComponent/AboutComponent.js';
import { ContactComponent } from '../ContactComponent/ContactComponent.js';
import { CompareComponent } from '../CompareComponent/CompareComponent.js';
export class AppControllerComponent {
    #container = null;
    #mapComponent = null;
    #hub = null;
    #aboutComponent = null;
    #contactComponent = null;
    #listComponent = null;
    #compareComponent = null;
    #sidebarLeftComponent = null;
    #sidebarRightComponent = null;

    constructor() {
        this.#hub = EventHub.getInstance();
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        this.#mapComponent = new MapComponent();
        this.#listComponent = new ListComponent();
        this.#aboutComponent = new AboutComponent();
        this.#contactComponent = new ContactComponent();
        this.#compareComponent = new CompareComponent();
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
        this.#hub.subscribe('LaunchFav', taskData => {
            this.#launchFav();
        });
        this.#hub.subscribe('LaunchAbout', taskData => {
            this.#launchAbout();
        });
        this.#hub.subscribe('LaunchContact', taskData => {
            this.#launchContact();
        });
        this.#hub.subscribe('LaunchCompare', taskData => {
            this.#launchCompare();
        });
        const launchMapButton = this.#container.querySelector('.btn');
        launchMapButton.addEventListener('click', () => {
            this.#hub.publish('LaunchMap', {});
        });
        const favButton = document.getElementById("list-button")
        favButton.addEventListener("click", () => {
            console.log("clicked")
            this.#hub.publish('LaunchFav', {});
        })
        const aboutButton = document.getElementById("about-button")
        aboutButton.addEventListener("click", () => {
            console.log("clicked about")
            this.#hub.publish('LaunchAbout', {});
        })
        const contactButton = document.getElementById("contact-button")
        contactButton.addEventListener("click", () => {
            console.log("clicked")
            this.#hub.publish('LaunchContact', {});
        })
        const compareButton = document.getElementById("compare-button")
        compareButton.addEventListener("click", () => {
            console.log("clicked")
            this.#hub.publish('LaunchCompare', {});
        })
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
     #launchFav() {
        console.log('Launching list');

        // Clear the container
        this.#container.innerHTML = '';
        
        // Add the map view class to the container
        this.#container.classList.add('list-container');
        
        // Append the map component
        const listElement = this.#listComponent.render();
        this.#container.appendChild(listElement);
    }
    #launchAbout() {
        console.log('Launching about');

        // Clear the container
        this.#container.innerHTML = '';
        
        this.#container.classList.add('about-container');
        
        // Append the about component
        const aboutElement = this.#aboutComponent.render();
        this.#container.appendChild(aboutElement);
    }
    #launchContact() {
        console.log('Launching contact');

        // Clear the container
        this.#container.innerHTML = '';
        
        this.#container.classList.add('contact-container');
        
        // Append the contact component
        const contactElement = this.#contactComponent.render();
        this.#container.appendChild(contactElement);
    }
    #launchCompare() {
        console.log('Launching compare');

        // Clear the container
        this.#container.innerHTML = '';
        
        this.#container.classList.add('compare-container');
        
        // Append the compare component
        const compareElement = this.#compareComponent.render();
        this.#container.appendChild(compareElement);
    }
}
