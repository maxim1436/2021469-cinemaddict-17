import AbstractView from '../framework/view/abstract-view';

const createFilmCounterTemplate = (filmsCount) => (`
  <section class="footer__statistics">
    <p>${filmsCount} movies inside</p>
  </section>
`);

export default class FilmCounterView extends AbstractView {
  constructor (filmsCount) {
    super();
    this.filmsCount = filmsCount;
  }

  get template () {
    return createFilmCounterTemplate(this.filmsCount);
  }
}
