import AbstractView from '../framework/view/abstract-view';

const createNavigationTemplate = (userDetails) => {
  const {
    watchList,
    alreadyWatched,
    favoriteFilms,
  } = userDetails;
  return (`
  <nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
  <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${alreadyWatched}</span></a>
  <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteFilms}</span></a>
  </nav>
  `);
};

export default class NavigationView extends AbstractView{
  #userDetails;
  constructor (userDetails) {
    super();
    this.#userDetails = userDetails;
  }

  get template () {
    return createNavigationTemplate(this.#userDetails);
  }
}
