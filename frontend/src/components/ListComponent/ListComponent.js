import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { EventHub } from '../../events/EventHub.js';
import { Events } from '../../events/Events.js';
export class ListComponent extends BaseComponent {
    #container = null;
    #favs = []; //To store favorites
    constructor() {
        super();
    }

    render() {
        if (this.#container) return this.#container;

        this.#createContainer();
        this.#setupContainerContent();
        this.#renderTasks();
        this.#attachEventListeners();

        return this.#container;
    }
    setFavs(favs) {
      this.#favs = favs;
      this.#renderTasks();
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
        let total = 0
        if(localStorage.getItem("total")){
        total = parseInt(localStorage.getItem("total"));
        }
        for(let i = 1; i <= total; i++){
          this.#favs.push(JSON.parse(localStorage.getItem(i)));
          
        }
        this.#favs.forEach(favData => {
            let list = document.createElement("div");
            list.className += "compare-container";
            let inner = document.createElement("div");
            inner.className += "list";
            if(favData){
              let stateSt = "";
              let townSt = "";
              if(favData.town !== undefined){
                townSt=favData.town
              }
              if(favData.normalizedTown  !== undefined){
                townSt=favData.normalizedTown
              }
              if(favData.state  !== undefined){
                stateSt=favData.state
              }
              if(favData.normalizedState  !== undefined){
                stateSt=favData.normalizedState
              }
            inner.textContent = townSt+", "+stateSt;
            }
            list.appendChild(inner);
            this.#container.appendChild(list);
        });
      }
    
      // Attaches the event listeners to the component
      #attachEventListeners() {
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

