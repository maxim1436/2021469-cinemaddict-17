import { createElement } from '../render';

const MINUTES_IN_HOUR = 60;

const createFilmCardTemplate = (card) => {
  const {
    filmInfo: {
      title,
      totalRating,
      runTime,
      poster,
      description,
      genre,
    },
    comments
  } = card;
  const filmHoursAmount = Math.floor(runTime / MINUTES_IN_HOUR);
  const filmMinutesAmount = runTime - (MINUTES_IN_HOUR * Math.floor(runTime / MINUTES_IN_HOUR));
  return (`
    <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">1929</span>
        <span class="film-card__duration">${filmHoursAmount}h ${filmMinutesAmount}m</span>
        <span class="film-card__genre">${genre.join(', ')}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
    </article>
  `);
};

export default class FilmCardView {
  constructor (card) {
    this.card = card;
  }

  getTemplate () {
    return createFilmCardTemplate(this.card);
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
