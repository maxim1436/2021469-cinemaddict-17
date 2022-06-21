import { render, replace, remove } from '../framework/render.js';
import NavigationView from '../view/navigation-view.js';

export default class NavigationPresenter {
  #navigationContainer = null;
  #navigationComponent = null;
  #handleFilterTypeChange = null;

  constructor (navigationContainer, handleFilterTypeChange) {
    this.#navigationContainer = navigationContainer;
    this.#handleFilterTypeChange = handleFilterTypeChange;
  }

  init = (userDetails) => {
    const prevNavigationComponent = this.#navigationComponent;

    this.#navigationComponent = new NavigationView(userDetails);
    this.#navigationComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevNavigationComponent === null) {
      return(render(this.#navigationComponent, this.#navigationContainer));
    } else {
      replace(this.#navigationComponent, prevNavigationComponent);
    }
    remove(prevNavigationComponent);
  };
}
