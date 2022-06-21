import RankUserView from './view/rank-user-view.js';
import MenuPresenter from './presenter/menu-presenter.js';
import { render } from './framework/render.js';
import FilmModel from './model/data.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsData = new FilmModel();
const menuPresenter = new MenuPresenter(siteMainElement, filmsData);

render(new RankUserView(), siteHeaderElement);
menuPresenter.init();
