import { render, replace, remove } from '../framework/render.js';
import NavigationView from '../view/navigation-view.js';

export default class NavigationPresenter {
  #navigationContainer = null;
  #navigationComponent = null;

  constructor (navigationContainer) {
    this.#navigationContainer = navigationContainer;
  }

  init = (userDetails) => {
    const prevNavigationComponent = this.#navigationComponent;

    this.#navigationComponent = new NavigationView(userDetails);

    if (prevNavigationComponent === null) {
      return(render(this.#navigationComponent, this.#navigationContainer));
    } else {
      replace(this.#navigationComponent, prevNavigationComponent);
    }
    remove(prevNavigationComponent);
  };
}
