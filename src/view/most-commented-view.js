import { createElement } from '../render';

const createMostCommentedTemplate = () => (`
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Most Commented</h2>
    <div class="films-list__container">

    </div>
  </section>
`);

export default class MostCommentedView {
  #element = null;
  get template () {
    return createMostCommentedTemplate();
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
