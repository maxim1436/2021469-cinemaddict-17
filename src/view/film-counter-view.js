import { createElement } from '../render';

const createFilmCounterTemplate = () => (`
  <section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>
`);

export default class FilmCounterdView {
  #element = null;

  get template () {
    return createFilmCounterTemplate();
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
