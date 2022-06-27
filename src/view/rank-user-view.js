import AbstractView from '../framework/view/abstract-view.js';

const MIN_ALREADY_WATCHED_MOVIES_LENGTH = 1;
const MIDDLE_ALREADY_WATCHED_MOVIES_LENGTH = 11;
const MAX_ALREADY_WATCHED_MOVIES_LENGTH = 21;

const createRankUserTemplate = (alreadyWatchedMovies) => {
  const getUserRank = () => {
    if (alreadyWatchedMovies.length >= MIN_ALREADY_WATCHED_MOVIES_LENGTH && alreadyWatchedMovies.length < MIDDLE_ALREADY_WATCHED_MOVIES_LENGTH) {
      return 'novice';
    }

    if (alreadyWatchedMovies.length >= MIDDLE_ALREADY_WATCHED_MOVIES_LENGTH && alreadyWatchedMovies.length < MAX_ALREADY_WATCHED_MOVIES_LENGTH) {
      return 'fan';
    }

    if (alreadyWatchedMovies.length >= MAX_ALREADY_WATCHED_MOVIES_LENGTH) {
      return 'movie buff';
    }
  };

  return (`
    <section class="header__profile profile">
      <p class="profile__rating">${getUserRank()}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `);
};

export default class RankUserView extends AbstractView {
  #alreadyWatchedMovies = null;
  constructor (alreadyWatchedMovies) {
    super();
    this.#alreadyWatchedMovies = alreadyWatchedMovies;
  }

  get template () {
    return createRankUserTemplate(this.#alreadyWatchedMovies);
  }
}
