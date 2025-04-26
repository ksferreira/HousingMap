export class CompareComponent extends BaseComponent {
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
        this.#container.classList.add('compare-container');
    }
    
    #setupContainerContent() {
        this.element.innerHTML = `
        div class="compare-container">
        <div class="selectbar">
            <select class="option1" id="o1">
                <option value="">  Select1  </option>
            </select>
            <select class="option2" id="o2">
                <option value="">  Select2  </option>
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