import { generateFilm } from '../moсk/film';
import { generateComment } from '../moсk/comment';

const FILMS_CARDS_AMOUNT = 20;
const COMMENTS_AMOUNT = 100;

export default class FilmModel {
  generateMovies = () => {
    const films = Array.from({length: FILMS_CARDS_AMOUNT}, generateFilm);
    const comments = Array.from({length: COMMENTS_AMOUNT}, generateComment);
    films.forEach((film) => {
      for(let i = 0; i < comments.length; i++) {
        if (film.comments.includes(comments[i].id)) {
          film.comments.push(comments[i]);
        }
      }
      film.comments.splice(0, film.comments.length / 2);
    });
    return films;
  };

  #movies = this.generateMovies();

  get movies () {
    return this.#movies;
  }
}
