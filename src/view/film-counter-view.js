import AbstractView from '../framework/view/abstract-view';

const createFilmCounterTemplate = () => (`
  <section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>
`);

export default class FilmCounterdView extends AbstractView {
  get template () {
    return createFilmCounterTemplate();
  }
}
