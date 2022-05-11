import RankUserView from './view/rank-user-view.js';
import MenuPresenter from './presenter/menu-presenter.js';
import {render} from './render.js';
import Data from './model/data.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const menuPresenter = new MenuPresenter();
const data = new Data();

render(new RankUserView(), siteHeaderElement);
menuPresenter.init(siteMainElement, data);
