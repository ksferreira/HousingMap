import { BaseComponent } from '../BaseComponent/BaseComponent.js';
export class CompareComponent extends BaseComponent {
    #container = null;
    #favs = []; //To store favorites


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
        let total = 0
        if(localStorage.getItem("total")){
        total = parseInt(localStorage.getItem("total"));
        }
        for(let i = 1; i <= total; i++){
          this.#favs.push(JSON.parse(localStorage.getItem(i)));
          
        }
        let i = 0;
        let options = this.#favs.reduce((a, c) => {let temp = ""; 
            if(c){
                let stateSt = "";
                let townSt = "";
                if(c.town !== undefined){
                  townSt=c.town
                }
                if(c.normalizedTown  !== undefined){
                  townSt=c.normalizedTown
                }
                if(c.state  !== undefined){
                  stateSt=c.state
                }
                if(c.normalizedState  !== undefined){
                  stateSt=c.normalizedState
                }
              temp = townSt+", "+stateSt;
              }; i=i+1; return a + "<option value="+i+">"+temp+"</option>";}, "")
        this.#container.innerHTML = `
        <div class="selectbar">
            <select class="option1" id="o1">
                <option value="">  Select  </option>
                `+options+`
            </select>
            <select class="option2" id="o2">
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
    
    #attachEventListeners() {
        const sLeft =  this.#container.querySelector('.option1');
        const sRight =  this.#container.querySelector('.option2');
            sLeft.addEventListener('change', () => {
               if(sLeft.value.length !== 0){
                const left =  this.#container.querySelector('.left');
                left.innerHTML = "";

                let     data = this.#favs[sLeft.selectedIndex-1].censusData;
                
                left.innerHTML = `
                <div>Population: ${data.population || 'N/A'}</div><br>
                <div>Median Income: ${data.medianIncome || 'N/A'}</div><br>
                <div>Median Home Value: ${data.medianHomeValue || 'N/A'}</div><br>
                <div>Total Housing Units: ${data.totalHousingUnits || 'N/A'}</div><br>
                <div>Owner-Occupied Units: ${data.ownerOccupiedUnits || 'N/A'}</div><br>
                <div>Renter-Occupied Units: ${data.renterOccupiedUnits || 'N/A'}</div><br>
                <div>Occupied Units: ${data.occupiedUnits || 'N/A'}</div><br>
                <div>Vacant Units: ${data.vacantUnits || 'N/A'}</div><br>
            `;
            }});    
            sRight.addEventListener('change', () => {
               if(sRight.value.length !== 0){
                const right =  this.#container.querySelector('.right');
                right.innerHTML = "";

                let    data = this.#favs[sRight.selectedIndex-1].censusData;
                
                right.innerHTML = `
               <div>Population: ${data.population || 'N/A'}</div><br>
                <div>Median Income: ${data.medianIncome || 'N/A'}</div><br>
                <div>Median Home Value: ${data.medianHomeValue || 'N/A'}</div><br>
                <div>Total Housing Units: ${data.totalHousingUnits || 'N/A'}</div><br>
                <div>Owner-Occupied Units: ${data.ownerOccupiedUnits || 'N/A'}</div><br>
                <div>Renter-Occupied Units: ${data.renterOccupiedUnits || 'N/A'}</div><br>
                <div>Occupied Units: ${data.occupiedUnits || 'N/A'}</div><br>
                <div>Vacant Units: ${data.vacantUnits || 'N/A'}</div><br>
            `;
            }});    
    }
}
