import { createElement } from '../render';

const createShowMoreButtonTemplate = () => `
  <button class="films-list__show-more">Show more</button>
`;

export default class ShowMoreButonView {
  getTemplate () {
    return createShowMoreButtonTemplate;
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
