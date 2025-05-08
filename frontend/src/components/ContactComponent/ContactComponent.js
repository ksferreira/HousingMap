import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class ContactComponent extends BaseComponent {
    #container = null;
    
    constructor() {
        super();
    }

    render() {
        if (this.#container) return this.#container;

        this.#createContainer();
        this.#setupContainerContent();
        // this.#attachEventListeners();

        return this.#container;
    }
    
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('hero-container');
    }
    
    #setupContainerContent() {
        this.#container.innerHTML = `
                <div class="hero">
            <div>Contact Us!</div>
            <div class="contact" style="margin-top: 10px;">
                <div class="contactName"> 
                    Kauan Ferreira
                </div>
                <div class="contactEmail"> 
                    ksferreira@umass.edu
                </div>
            </div>
            <div class="contact">
                <div class="contactName"> 
                    Daniel Kennedy
                </div>
                <div class="contactEmail"> 
                    dmkennedy@umass.edu
                </div>
            </div>
            <div class="contact">
                <div class="contactName"> 
                    John Hankwitz
                </div>
                <div class="contactEmail"> 
                    jhankwitz@umass.edu
                </div>
            </div>
        </div>
        `;


    }
    
}
