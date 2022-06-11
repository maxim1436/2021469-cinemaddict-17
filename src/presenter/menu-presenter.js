import NavigationPresenter from './navigation-presenter.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmCounterdView from '../view/film-counter-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import { render } from '../framework/render.js';
import { getRandomInteger, updateItem } from '../utils.js';
import NoFilmView from '../view/no-film-view.js';
import MoviePresenter from './movie-presenter.js';

const FILMS_CARDS_PER_STEP = 5;
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

export default class MenuPresenter {
  #menuContainer = null;
  #filmsData = null;
  #movies = [];
  #userDetails = {};
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmCount = FILMS_CARDS_PER_STEP;
  #moviePresenter = new Map();
  #navigationPresenter = null;

  constructor (menuContainer, filmsData) {
    this.#menuContainer = menuContainer;
    this.#filmsData = filmsData;
    this.#movies = this.#filmsData.movies;
    this.#userDetails = this.#filmsData.userDetails;
  }

  films = new FilmsView();
  filmsList = new FilmsListView();
  filmsListContainer = this.filmsList.element.querySelector('div');
  topRated = new TopRatedView();
  topRatedFilmsContainer =this.topRated.element.querySelector('div');
  mostCommented = new MostCommentedView();
  mostCommentedContainer = this.mostCommented.element.querySelector('div');

  #handleMovieChange = (updatedMovie, propertyBeforeUpdate) => {
    this.#movies = updateItem(this.#movies, updatedMovie);

    if (!updatedMovie.userDetails.watchlist === propertyBeforeUpdate.userDetails.watchlist) {
      if (this.#userDetails.watchlist.includes(updatedMovie.id)) {
        const indexToDelete = this.#userDetails.watchlist.findIndex((movie) => movie === updatedMovie.id);
        this.#userDetails.watchlist.splice(indexToDelete, 1);
        this.#navigationPresenter.init(this.#userDetails);
        return;
      } else {
        this.#userDetails.watchlist.push(updatedMovie.id);
        this.#navigationPresenter.init(this.#userDetails);
        return;
      }
    }

    if (!updatedMovie.userDetails.alreadyWatched === propertyBeforeUpdate.userDetails.alreadyWatched) {
      if (this.#userDetails.alreadyWatched.includes(updatedMovie.id)) {
        const indexToDelete = this.#userDetails.alreadyWatched.findIndex((movie) => movie === updatedMovie.id);
        this.#userDetails.alreadyWatched.splice(indexToDelete, 1);
        this.#navigationPresenter.init(this.#userDetails);
        return;
      } else {
        this.#userDetails.alreadyWatched.push(updatedMovie.id);
        this.#navigationPresenter.init(this.#userDetails);
        return;
      }
    }

    if (!updatedMovie.userDetails.favorite === propertyBeforeUpdate.userDetails.favorite) {
      if (this.#userDetails.favoriteFilms.includes(updatedMovie.id)) {
        const indexToDelete = this.#userDetails.favoriteFilms.findIndex((movie) => movie === updatedMovie.id);
        this.#userDetails.favoriteFilms.splice(indexToDelete, 1);
        this.#navigationPresenter.init(this.#userDetails);
      } else {
        this.#userDetails.favoriteFilms.push(updatedMovie.id);
        this.#navigationPresenter.init(this.#userDetails);
      }
    }
  };

  #renderMovie = (movie, container) => {
    const cardMovie = new MoviePresenter(container, siteBodyElement, this.#handleMovieChange, this.#closePrevOpenedPopup);
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
    render(new SortView(), this.#menuContainer);
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

  init = () => {
    this.#navigationPresenter = new NavigationPresenter(this.#menuContainer);
    this.#navigationPresenter.init(this.#userDetails);
    if(this.#movies.length <= 0) {
      this.#renderMenuWithNoMovies();
    } else {
      this.#renderMenuWithSomeMovies();
    }

    render(new FilmCounterdView(this.#movies.length), siteFooterElement);
  };
}
