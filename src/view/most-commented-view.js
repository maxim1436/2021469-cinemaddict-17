import { createElement } from '../render';

const createMostCommentedTemplate = () => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Most Commented</h2>
    <div class="films-list__container">

    </div>
  </section>
`;

export default class MostCommentedView {
  getTemplate () {
    return createMostCommentedTemplate;
  }

  getElement () {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
