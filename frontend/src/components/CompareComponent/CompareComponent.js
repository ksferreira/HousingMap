import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import {TownStatsService} from '../../../../backend/src/services/TownStatsService.js'
export class CompareComponent extends BaseComponent {
    #container = null;
    #favs = ["Ex1", "Ex2", "Ex3"]; //To store favorites
    #townStatsService  = null;

    constructor() {
        super();
        this.#townStatsService = new TownStatsService();
    }

    render() {
        if (this.#container) return this.#container;

        this.#createContainer();
        this.#setupContainerContent();
        //this.#attachEventListeners();
        console.log("ren")
        console.log(this.#townStatsService.fetchFreshStats("Northfield", "MA"))
        return this.#container;
    }
    
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('compare-container');
    }
    
    #setupContainerContent() {
        let options = this.#favs.reduce((a, c) => {return a + "<option>"+c+"</option>";}, "")
        this.#container.innerHTML = `
        <div class="selectbar">
            <select class="option" id="o1">
                <option value="">  Select  </option>
                `+options+`
            </select>
            <select class="option" id="o2">
                <option value="">  Select  </option>
                `+options+`
            </select>
        </div>
        <div style="flex: display; flex-direction: row;" class="compare">
            <div class="left" id="cl">
            </div>
            <div class="right" id="cr">
            </div>
        </div>
        </div>
        `;
    }
    
}
