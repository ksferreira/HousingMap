import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class AboutComponent extends BaseComponent {
    #container = null;
    
    constructor() {
        super();
    }

    render() {
        if (this.#container) return this.#container;

        this.#createContainer();
        this.#setupContainerContent();
        console.log(this.element.innerHTML)
        // this.#attachEventListeners();

        return this.#container;
    }
    
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('about-container');
    }
    
    #setupContainerContent() {
        this.#container.innerHTML = `
        <div class="hero">
            <h1>About</h1>
            <p>This site was built for the purpose of helping people find affordable housing by helping them 
                compare data between counties allowing them to get a general overview when considering if they 
                should look for housing in any particular county.
            <br />
            Project By Kauan Ferreira, John Hankwitz, and Daniel Kennedy as part of COMPSCI 326 in the spring of 2025.
            <br />
            This is the first implementation of the frontend, dated 3/28/2025.</p>
        </div>
        `;
    }
    
    
}
