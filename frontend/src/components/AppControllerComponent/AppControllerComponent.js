import { EventHub } from '../../events/EventHub.js';

export class AppControllerComponent {
    #container = null;

    constructor() {
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();
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
        this.#container.classList.add('hero-container');
        this.#container.setAttribute('id', 'app-controller-container');
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
        const hub = EventHub.getInstance();

        hub.subscribe('LaunchMap', taskData => {
            console.log(taskData);
            
        });

        const launchMapButton = this.#container.querySelector('.btn');
        launchMapButton.addEventListener('click', () => {
            hub.publish('LaunchMap', {});
        });

    }

}