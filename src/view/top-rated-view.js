import { createElement } from '../render';

const createTopRatedTemplate = () => (`
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
  </section>
`);

export default class TopRatedView {
  #element = null;

  get template () {
    return createTopRatedTemplate();
  }

  get element () {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement () {
    this.#element = this.#element.remove();
    this.#element = null;
  }
}
