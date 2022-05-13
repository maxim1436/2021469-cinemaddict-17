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
import {render} from '../render.js';
import { getRandomInteger } from '../utils.js';
import NoFilmView from '../view/no-film-view.js';

const FILMS_CARDS_PER_STEP = 5;
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

export default class MenuPresenter {
  #menuContainer = null;
  #filmsData = null;
  #movies = [];
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmCount = FILMS_CARDS_PER_STEP;
  constructor (filmsData) {
    this.#filmsData = filmsData;
  }

  films = new FilmsView();
  filmsList = new FilmsListView();
  filmsListContainer = this.filmsList.element.querySelector('div');
  topRated = new TopRatedView();
  topRatedFilmsContainer =this.topRated.element.querySelector('div');
  mostCommented = new MostCommentedView();
  mostCommentedContainer = this.mostCommented.element.querySelector('div');

  #renderMovie = (movie) => {
    const movieComponent = new FilmCardView(movie);
    movieComponent.element.addEventListener('click', () => {
      siteBodyElement.classList.add('hide-overflow');

      if(siteBodyElement.querySelector('.film-details')) {
        siteBodyElement.querySelector('.film-details').remove();
      }

      const popupMovie = new PopupView(movie);
      render(popupMovie, siteBodyElement);

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          popupMovie.removeElement();
          siteBodyElement.classList.remove('hide-overflow');
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };
      document.addEventListener('keydown', onEscKeyDown);

      popupMovie.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
        popupMovie.removeElement();
        siteBodyElement.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      });
    });

    render(movieComponent, this.filmsListContainer);
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#movies
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILMS_CARDS_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedFilmCount += FILMS_CARDS_PER_STEP;
    if(this.#renderedFilmCount >= this.#movies.length) {
      this.#showMoreButtonComponent.removeElement();
    }
  };

  init = (menuContainer) => {
    this.#menuContainer = menuContainer;
    this.#movies = this.#filmsData.movies;
    render(new NavigationView(), this.#menuContainer);
    if(this.#movies.length <= 0) {
      render(this.films, this.#menuContainer);
      render(this.filmsList, this.films.element);
      render(new NoFilmView(), this.filmsList.element);
    } else {
      render(new SortView(), this.#menuContainer);
      render(this.films, this.#menuContainer);
      render(this.filmsList, this.films.element);

      for (let i = 0; i < Math.min(this.#movies.length, FILMS_CARDS_PER_STEP); i++) {
        this.#renderMovie(this.#movies[i]);
      }

      if (this.#movies.length > FILMS_CARDS_PER_STEP) {
        render(this.#showMoreButtonComponent, this.filmsList.element);
        this.#showMoreButtonComponent.element.addEventListener('click', this.#handleShowMoreButtonClick);
      }

      render(this.topRated, this.films.element);
      render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.topRatedFilmsContainer);
      render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.topRatedFilmsContainer);

      render(this.mostCommented, this.films.element);
      render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.mostCommentedContainer);
      render(new FilmCardView(this.#movies[getRandomInteger(0, this.#movies.length - 1)]), this.mostCommentedContainer);
    }

    render(new FilmCounterdView(), siteFooterElement);
  };
}
