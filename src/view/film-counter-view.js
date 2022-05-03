import { createElement } from '../render';

const createFilmCounterTemplate = () => (`
  <section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>
`);

export default class FilmCounterdView {
  getTemplate () {
    return createFilmCounterTemplate;
  }

  getElement () {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = this.element.remove();
  }
}
