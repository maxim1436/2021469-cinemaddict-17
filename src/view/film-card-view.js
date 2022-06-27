import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';
import { addControlButtons } from '../utils';

const MINUTES_IN_HOUR = 60;
const MAX_DESCRIPTION_LENGTH = 140;
const MIN_DESCRIPTION_LENGTH = 0;

const createFilmCardTemplate = (card) => {
  const {
    filmInfo: {
      title,
      totalRating,
      runtime,
      poster,
      description,
      genre,
      release: {
        date,
      }
    },
    comments,
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    }
  } = card;

  const addRuntime = () => {
    const filmHoursAmount = Math.floor(runtime / MINUTES_IN_HOUR);
    const filmMinutesAmount = runtime - (MINUTES_IN_HOUR * Math.floor(runtime / MINUTES_IN_HOUR));
    if (filmHoursAmount <= 0) {
      return (`${filmMinutesAmount}m`);
    } else {
      return (`${filmHoursAmount}h ${filmMinutesAmount}m`);
    }
  };


  const addDescription = () => {
    if (description.length <= MAX_DESCRIPTION_LENGTH) {
      return description;
    } else {
      return (`${description.substring(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH)}...`);
    }
  };

  return (`
    <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
        <span class="film-card__duration">${addRuntime()}</span>
        <span class="film-card__genre">${genre.join(', ')}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${addDescription()}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      ${addControlButtons(watchlist, alreadyWatched, favorite)}
    </div>
    </article>
  `);
};

export default class FilmCardView extends AbstractView{
  #card;

  constructor (card) {
    super();
    this.#card = card;
  }

  get template () {
    return createFilmCardTemplate(this.#card);
  }

  setOpenPopupClickHandler = (callback, movie) => {
    this._callback.click = callback;
    return (this.element.querySelector('.film-card__link').addEventListener('click', this.#cardMovieClickHandler(movie)));
  };

  #cardMovieClickHandler = (movie) => (evt) => {
    evt.preventDefault();
    this._callback.click(movie);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    return this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#FavoriteClickHandler);
  };

  #FavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(this.element);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    return this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHadler);
  };

  #watchlistClickHadler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(this.element);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    return this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick(this.element);
  };

}
