import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../utils';

const createNavigationTemplate = (userDetails = {watchlist: [], alreadyWatched: [], favoriteFilms: []}) => {
  const {
    watchlist,
    alreadyWatched,
    favoriteFilms,
  } = userDetails;
  return (`
  <nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="${FilterType.DEFAULT}">All movies</a>
  <a href="#watchlist" class="main-navigation__item" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count" data-filter-type="${FilterType.WATCHLIST}">${watchlist.length}</span></a>
  <a href="#history" class="main-navigation__item" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count" data-filter-type="${FilterType.HISTORY}">${alreadyWatched.length}</span></a>
  <a href="#favorites" class="main-navigation__item" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count" data-filter-type="${FilterType.FAVORITES}">${favoriteFilms.length}</span></a>
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

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A' && evt.target.tagName !== 'SPAN') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };
}
