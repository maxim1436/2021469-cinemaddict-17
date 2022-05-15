import { createElement } from '../render';

const createNoFilmTemplate = () => (`
  <h2 class="films-list__title">There are no movies in our database</h2>
`);

export default class NoFilmView {
  #element = null;

  get template () {
    return createNoFilmTemplate();
  }

  get element () {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement () {
    this.#element = this.#element.remove();
  }
}
