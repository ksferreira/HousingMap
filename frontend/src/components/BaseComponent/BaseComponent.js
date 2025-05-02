export class BaseComponent {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('container');

        this.cssLoaded = false;
    }

    render() {
        throw new Error('render() must be implemented');
    }

    loadCSS(filename) {
        if (this.cssLoaded) return;

        const link = document.createElement('link');
        link.href = `./components/${filename}.css`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        this.cssLoaded = true;
    }

    dispatchCustomEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail: detail });
        this.parent.dispatchEvent(event);
    }

    subscribeToCustomEvent(event, callback) {
        this.parent.addEventListener(event, callback);
    }
}
