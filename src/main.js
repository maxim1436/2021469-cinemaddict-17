import RankUserView from './view/rank-user-view.js';
import MenuPresenter from './presenter/menu-presenter.js';
import {render} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const menuPresenter = new MenuPresenter();

render(new RankUserView(), siteHeaderElement);
menuPresenter.init(siteMainElement);
