import NavigationView from '../view/navigation-view.js';
import SortView from '../view/sort-view.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButonView from '../view/show-more-button-view.js';
import PopupView from '../view/popup-view.js';
import FilmCounterdView from '../view/film-counter-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import {render} from '../render.js';

const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

export default class MenuPresenter {
  films = new FilmsView();
  filmsList = new FilmsListView();
  filmsListContainer = this.filmsList.getElement().querySelector('div');
  topRated = new TopRatedView();
  topRatedFilmsContainer =this.topRated.getElement().querySelector('div');
  mostCommented = new MostCommentedView();
  mostCommentedContainer = this.mostCommented.getElement().querySelector('div');

  init = (menuContainer) => {
    this.menuContainer = menuContainer;

    render(new NavigationView(), this.menuContainer);
    render(new SortView(), this.menuContainer);
    render(this.films, this.menuContainer);
    render(this.filmsList, this.films.getElement());

    for (let i = 0; i < 5;i++) {
      render(new FilmCardView(), this.filmsListContainer);
    }
    render(new ShowMoreButonView(), this.filmsList.getElement());

    render(this.topRated, this.films.getElement());
    render(new FilmCardView(), this.topRatedFilmsContainer);
    render(new FilmCardView(), this.topRatedFilmsContainer);

    render(this.mostCommented, this.films.getElement());
    render(new FilmCardView(), this.mostCommentedContainer);
    render(new FilmCardView(), this.mostCommentedContainer);

    render(new PopupView(), siteBodyElement);
    render(new FilmCounterdView(), siteFooterElement);
  };
}
