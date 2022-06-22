import AbstractView from '../framework/view/abstract-view.js';

const createRankUserTemplate = (alreadyWatchedMovies) => {
  const getUserRank = () => {
    if (alreadyWatchedMovies.length >= 1 && alreadyWatchedMovies.length <= 10) {
      return 'novice';
    }

    if (alreadyWatchedMovies.length >= 11 && alreadyWatchedMovies.length <= 20) {
      return 'fan';
    }

    if (alreadyWatchedMovies.length >= 21) {
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
