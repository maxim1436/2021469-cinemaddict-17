import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import PopupView from '../view/popup-view.js';
import FilmCounterdView from '../view/film-counter-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import { render } from '../framework/render.js';
import { getRandomInteger } from '../utils.js';
import NoFilmView from '../view/no-film-view.js';

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

  #hadleOpenPopupClick = (movie) => {
    siteBodyElement.classList.add('hide-overflow');

    if(siteBodyElement.querySelector('.film-details')) {
      siteBodyElement.querySelector('.film-details').remove();
    }
    const popupMovie = new PopupView(movie);
    render(popupMovie, siteBodyElement);

    const handleClosePopupClick = () => {
      popupMovie.element.remove();
      siteBodyElement.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        popupMovie.element.remove();
        siteBodyElement.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    document.addEventListener('keydown', onEscKeyDown);
    popupMovie.setClickHandler(handleClosePopupClick);
  };

  #renderMovie = (movie) => {
    const movieComponent = new FilmCardView(movie);
    movieComponent.setClickHandler(this.#hadleOpenPopupClick, movie);
    render(movieComponent, this.filmsListContainer);
  };

  #handleShowMoreButtonClick = () => {
    this.#movies
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_CARDS_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

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
      this.#renderMovie(this.#movies[i]);
    }

    if (this.#movies.length > FILMS_CARDS_PER_STEP) {
      render(this.#showMoreButtonComponent, this.filmsList.element);
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }

    render(this.topRated, this.films.element);
    render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.topRatedFilmsContainer);
    render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.topRatedFilmsContainer);

    render(this.mostCommented, this.films.element);
    render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.mostCommentedContainer);
    render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.mostCommentedContainer);
  };

  init = () => {

    render(new NavigationView(this.#userDetails), this.#menuContainer);
    if(this.#movies.length <= 0) {
      this.#renderMenuWithNoMovies();
    } else {
      this.#renderMenuWithSomeMovies();
    }

    render(new FilmCounterdView(this.#movies.length), siteFooterElement);
  };
}
