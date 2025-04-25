
export class AppControllerComponent {
    #container = null;

    constructor() {
        super();
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
        this.element.innerHTML = `
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

        const launchMapButton = this.element.querySelector('.btn');
        launchMapButton.addEventListener('click', () => {
            hub.publish('LaunchMap', {});
        });

    }

}