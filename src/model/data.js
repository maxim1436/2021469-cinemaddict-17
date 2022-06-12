import { generateFilm } from '../moсk/film';
import { generateComment } from '../moсk/comment';

const FILMS_CARDS_AMOUNT = 30;
const COMMENTS_AMOUNT = 100;

export default class FilmModel {

  generateMovies = () => {
    const watchListFilms = [];
    const alreadyWatchedFilms = [];
    const favoriteFilms = [];
    const films = Array.from({length: FILMS_CARDS_AMOUNT}, generateFilm);
    const comments = Array.from({length: COMMENTS_AMOUNT}, generateComment);
    films.forEach((film) => {
      for(let i = 0; i < comments.length; i++) {
        if (film.comments.includes(comments[i].id)) {
          film.comments.push(comments[i]);
        }
      }
      film.comments.splice(0, film.comments.length / 2);

      if (film.userDetails.watchlist) {
        watchListFilms.push(film.id);
      }

      if (film.userDetails.alreadyWatched) {
        alreadyWatchedFilms.push(film.id);
      }

      if (film.userDetails.favorite) {
        favoriteFilms.push(film.id);
      }

    });
    return {
      movies: films,
      userDetails:{
        watchlist: watchListFilms,
        alreadyWatched: alreadyWatchedFilms,
        favoriteFilms: favoriteFilms,
      },
    };
  };

  #moviesData = this.generateMovies();

  get moviesData () {
    return this.#moviesData;
  }

  set moviesData (newData) {
    this.#moviesData = newData;
  }
}
