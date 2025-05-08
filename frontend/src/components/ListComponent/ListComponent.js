import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class ListComponent extends BaseComponent {
    #container = null;
    #favs = ["Ex1", "Ex2", "Ex3"]; //To store favorites
    constructor() {
        super();
    }

    render() {
        if (this.#container) return this.#container;

        this.#createContainer();
        this.#setupContainerContent();
        this.#renderTasks();
        //this.#attachEventListeners();

        return this.#container;
    }
    
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('list-container');
    }
    
    #setupContainerContent() {
        this.element.innerHTML = `
        <div id="list-container" style="overflow-y: scroll;">
            <div class="compare-container" id="outer">
            </div>
        </div>
        `;
    }

    #renderTasks() {
        //  const favList = this.#container.querySelector('#outer');
        //  favList.innerHTML = ''; // Clear existing content

        this.#favs.forEach(favData => {
            let list = document.createElement("div");
            list.className += "compare-container";
            let inner = document.createElement("div");
            inner.className += "list";
            inner.textContent = favData;
            list.appendChild(inner);
            this.#container.appendChild(list);
        });
      }
    
      // Attaches the event listeners to the component
      #attachEventListeners() {
        const backToMainViewBtn = this.#container.querySelector('#backToMainViewBtn');
        const hub = EventHub.getInstance();
        hub.subscribe(Events.NewFav, (favData) => {
          this.#favs.push(favData);      
          this.#renderTasks();
        });
    
        hub.subscribe(Events.UnStoreFav, () => {
          this.#favs = [];
          this.#renderTasks();
        });
      }

}
