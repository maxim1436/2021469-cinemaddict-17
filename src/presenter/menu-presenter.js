import NavigationPresenter from './navigation-presenter.js';
import RankUserView from '../view/rank-user-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmCounterdView from '../view/film-counter-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import { render, replace, remove } from '../framework/render.js';
import { getRandomInteger, SortType, sortMoviesDateDown, sortMoviesRatingDown, FilterType } from '../utils.js';
import NoFilmView from '../view/no-film-view.js';
import MoviePresenter from './movie-presenter.js';

const FILMS_CARDS_PER_STEP = 5;
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');

export default class MenuPresenter {
  #menuContainer = null;
  #filmsModel = null;
  #movies = [];
  #sourcedMovies = [];
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.DEFAULT;
  #userDetails = {};
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmCount = FILMS_CARDS_PER_STEP;
  #moviePresenter = new Map();
  #navigationPresenter = null;
  #sortComponent = new SortView();
  #rankUserComponent = null;

  constructor (menuContainer, filmsData) {
    this.#menuContainer = menuContainer;
    this.#filmsModel = filmsData;
    this.#movies = this.#filmsModel.moviesData.movies;
    this.#userDetails = this.#filmsModel.moviesData.userDetails;
  }

  films = new FilmsView();
  filmsList = new FilmsListView();
  filmsListContainer = this.filmsList.element.querySelector('div');
  topRated = new TopRatedView();
  topRatedFilmsContainer =this.topRated.element.querySelector('div');
  mostCommented = new MostCommentedView();
  mostCommentedContainer = this.mostCommented.element.querySelector('div');

  get movies() {
    return this.#filmsModel.moviesData.movies;
  }

  #handleMovieChange = (updatedMovie, propertyBeforeUpdate) => {
    this.#filmsModel.updateMovie(updatedMovie);

    if (!updatedMovie.userDetails.watchlist === propertyBeforeUpdate.userDetails.watchlist) {
      const indexToDelete = this.#userDetails.watchlist.findIndex((movie) => movie === updatedMovie.id);
      if (indexToDelete > -1) {
        this.#userDetails.watchlist.splice(indexToDelete, 1);
        this.#navigationPresenter.init(this.#userDetails);
        if (this.#currentFilterType !== FilterType.DEFAULT) {
          this.#currentFilterType = FilterType.DEFAULT;
          this.#handleFilterTypeChange(FilterType.WATCHLIST);
        }
        return;
      } else {
        this.#userDetails.watchlist.push(updatedMovie.id);
        this.#navigationPresenter.init(this.#userDetails);
        return;
      }
    }

    if (!updatedMovie.userDetails.alreadyWatched === propertyBeforeUpdate.userDetails.alreadyWatched) {
      const indexToDelete = this.#userDetails.alreadyWatched.findIndex((movie) => movie === updatedMovie.id);
      if (indexToDelete > -1) {
        this.#userDetails.alreadyWatched.splice(indexToDelete, 1);
        this.#navigationPresenter.init(this.#userDetails);
        if (this.#currentFilterType !== FilterType.DEFAULT) {
          this.#currentFilterType = FilterType.DEFAULT;
          this.#handleFilterTypeChange(FilterType.HISTORY);
        }
        this.#renderRankUser();
        return;
      } else {
        this.#userDetails.alreadyWatched.push(updatedMovie.id);
        this.#navigationPresenter.init(this.#userDetails);
        this.#renderRankUser();
        return;
      }
    }

    if (!updatedMovie.userDetails.favorite === propertyBeforeUpdate.userDetails.favorite) {
      const indexToDelete = this.#userDetails.favoriteFilms.findIndex((movie) => movie === updatedMovie.id);
      if (indexToDelete > -1) {
        this.#userDetails.favoriteFilms.splice(indexToDelete, 1);
        this.#navigationPresenter.init(this.#userDetails);
        if (this.#currentFilterType !== FilterType.DEFAULT) {
          this.#currentFilterType = FilterType.DEFAULT;
          this.#handleFilterTypeChange(FilterType.FAVORITES);
        }
      } else {
        this.#userDetails.favoriteFilms.push(updatedMovie.id);
        this.#navigationPresenter.init(this.#userDetails);
      }
    }
  };

  #filterMovies = (filterType) => {
    if (this.#currentSortType === SortType.DEFAULT) {
      this.#movies = [...this.#sourcedMovies];
    } else {
      this.#movies = [...this.#sourcedMovies];
      this.#sortMovies(this.#currentSortType);
    }
    switch (filterType) {
      case FilterType.WATCHLIST:
        this.#movies = this.#movies.filter((movie) => movie.userDetails.watchlist === true);
        break;
      case FilterType.HISTORY:
        this.#movies = this.#movies.filter((movie) => movie.userDetails.alreadyWatched === true);
        break;
      case FilterType.FAVORITES:
        this.#movies = this.#movies.filter((movie) => movie.userDetails.favorite === true);
        break;
    }

    this.#currentFilterType = filterType;
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }
    this.#filterMovies(filterType);
    this.#clearFilmsListContainer();
    if (filterType === FilterType.FAVORITES && this.#userDetails.favoriteFilms.length === 0) {
      const noFavoriteMoviesMessage = document.createElement('h2');
      noFavoriteMoviesMessage.classList.add('films-list__title');
      noFavoriteMoviesMessage.textContent = 'There are no favorite movies now';
      this.filmsListContainer.appendChild(noFavoriteMoviesMessage);
    } else if (filterType === FilterType.HISTORY && this.#userDetails.alreadyWatched.length === 0) {
      const noAlreadyWatchedMoviesMessage = document.createElement('h2');
      noAlreadyWatchedMoviesMessage.classList.add('films-list__title');
      noAlreadyWatchedMoviesMessage.textContent = 'There are no watched movies now';
      this.filmsListContainer.appendChild(noAlreadyWatchedMoviesMessage);
    } else if (filterType === FilterType.WATCHLIST && this.#userDetails.watchlist.length === 0) {
      const noWatchlistMoviesMessage = document.createElement('h2');
      noWatchlistMoviesMessage.classList.add('films-list__title');
      noWatchlistMoviesMessage.textContent = 'There are no movies to watch now';
      this.filmsListContainer.appendChild(noWatchlistMoviesMessage);
    } else {
      for (let i = 0; i < Math.min(this.#movies.length, FILMS_CARDS_PER_STEP); i++) {
        this.#renderMovie(this.#movies[i], this.filmsListContainer);
      }
      if (this.#movies.length > FILMS_CARDS_PER_STEP) {
        render(this.#showMoreButtonComponent, this.filmsList.element);
        this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
      }
    }

    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.topRatedFilmsContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.topRatedFilmsContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.mostCommentedContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.mostCommentedContainer);
  };

  #renderFilter = () => {
    this.#navigationPresenter = new NavigationPresenter(this.#menuContainer, this.#handleFilterTypeChange);
    this.#navigationPresenter.init(this.#userDetails);
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#movies.sort(sortMoviesDateDown);
        break;
      case SortType.BY_RATING:
        this.#movies.sort(sortMoviesRatingDown);
        break;
      default:
        this.#movies = [...this.#sourcedMovies];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearFilmsListContainer();
    for (let i = 0; i < Math.min(this.#movies.length, FILMS_CARDS_PER_STEP); i++) {
      this.#renderMovie(this.#movies[i], this.filmsListContainer);
    }
    if (this.#movies.length > FILMS_CARDS_PER_STEP) {
      render(this.#showMoreButtonComponent, this.filmsList.element);
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.topRatedFilmsContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.topRatedFilmsContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.mostCommentedContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.mostCommentedContainer);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#menuContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderMovie = (movie, container) => {
    const cardMovie = new MoviePresenter(container, siteBodyElement, this.#handleMovieChange, this.#closePrevOpenedPopup, this.#filmsModel.addComment, this.#filmsModel.deleteComment);
    cardMovie.init(movie);
    this.#moviePresenter.set(movie.id, cardMovie);
  };

  #handleShowMoreButtonClick = () => {
    this.#movies
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_CARDS_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.filmsListContainer));

    this.#renderedFilmCount += FILMS_CARDS_PER_STEP;
    if(this.#renderedFilmCount >= this.#movies.length) {
      this.#showMoreButtonComponent.element.remove();
    }
  };

  #renderMenuWithNoMovies = () => {
    render(this.films, this.#menuContainer);
    render(this.filmsList, this.films.element);
    render(new NoFilmView(), this.filmsList.element);
  };

  #renderMenuWithSomeMovies = () => {
    this.#renderSort();
    render(this.films, this.#menuContainer);
    render(this.filmsList, this.films.element);

    for (let i = 0; i < Math.min(this.#movies.length, FILMS_CARDS_PER_STEP); i++) {
      this.#renderMovie(this.#movies[i], this.filmsListContainer);
    }

    if (this.#movies.length > FILMS_CARDS_PER_STEP) {
      render(this.#showMoreButtonComponent, this.filmsList.element);
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }

    render(this.topRated, this.films.element);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.topRatedFilmsContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.topRatedFilmsContainer);

    render(this.mostCommented, this.films.element);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.mostCommentedContainer);
    this.#renderMovie(this.#movies[getRandomInteger(0, this.#movies.length - 1)], this.mostCommentedContainer);
  };

  #closePrevOpenedPopup = () => {
    const prevOpenedPopup = siteBodyElement.querySelector('.film-details');
    if(prevOpenedPopup) {
      prevOpenedPopup.remove();
    }
  };

  #clearFilmsListContainer = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#renderedFilmCount = FILMS_CARDS_PER_STEP;
    this.#moviePresenter.clear();
    this.#showMoreButtonComponent.element.remove();
    this.filmsListContainer.innerHTML = '';
  };

  #renderRankUser = () => {
    if (this.#userDetails.alreadyWatched.length > 0) {
      const prevRankUserComponent = this.#rankUserComponent;
      this.#rankUserComponent = new RankUserView(this.#userDetails.alreadyWatched);
      if (prevRankUserComponent === null) {
        render(this.#rankUserComponent, siteHeaderElement);
      } else {
        replace(this.#rankUserComponent, prevRankUserComponent);
      }
      remove(prevRankUserComponent);
    } else {
      this.#rankUserComponent.element.remove();
      this.#rankUserComponent = null;
    }
  };

  init = () => {
    this.#renderRankUser();
    this.#sourcedMovies = [...this.#filmsModel.moviesData.movies];
    this.#renderFilter();
    if(this.#movies.length <= 0) {
      this.#renderMenuWithNoMovies();
    } else {
      this.#renderMenuWithSomeMovies();
    }

    render(new FilmCounterdView(this.#movies.length), siteFooterElement);
  };
}
