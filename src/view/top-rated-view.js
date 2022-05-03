import { createElement } from '../render';

const createTopRatedTemplate = () => (`
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
  </section>
`);

export default class TopRatedView {
  getTemplate () {
    return createTopRatedTemplate;
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
