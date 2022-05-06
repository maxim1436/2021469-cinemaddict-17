import { generateFilm } from '../mosk/film';
import { generateComment } from '../mosk/comment';

const FILMS_CARDS_AMOUNT = 5;
const COMMENTS_AMOUNT = 10;

export default class DataObjects {
  films = Array.from({length: FILMS_CARDS_AMOUNT}, generateFilm);
  comments = Array.from({length: COMMENTS_AMOUNT}, generateComment);

  getFilms = () => this.films;
  getComments = () => this.comments;
}
