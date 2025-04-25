import { AppControllerComponent } from './components/AppControllerComponent/AppControllerComponent.js';

const appControllerComponent = new AppControllerComponent();

const appContainer = document.querySelector('.app');
appContainer.appendChild(appControllerComponent.render());



