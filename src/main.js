import MenuPresenter from './presenter/menu-presenter.js';
import FilmModel from './model/film-model.js';
import MoviesApiService from './movie-api-service.js';
import LoadingView from './view/loading-view.js';
import NavigationView from './view/navigation-view.js';
import { render} from './framework/render.js';

const AUTHORIZATION = 'Basic fvvj123n345d3nbf';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');

const filmsData = new FilmModel(new MoviesApiService(END_POINT, AUTHORIZATION));

const navigationComponent = new NavigationView();
const loadinComponent = new LoadingView();

render(navigationComponent, siteMainElement);
render(loadinComponent, siteMainElement);
for (const link of navigationComponent.element.querySelectorAll('a')) {
  link.removeAttribute('href');
}

filmsData.init().then(() => {
  loadinComponent.element.remove();
  navigationComponent.element.remove();
  const menuPresenter = new MenuPresenter(siteMainElement, filmsData);
  menuPresenter.init();
});


