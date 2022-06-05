import { generateFilm } from '../moсk/film';
import { generateComment } from '../moсk/comment';

const FILMS_CARDS_AMOUNT = 30;
const COMMENTS_AMOUNT = 100;

export default class FilmModel {

  generateMovies = () => {
    let watchListCounter = 0;
    let alreadyWatchedCounter = 0;
    let favoriteFilmsCounter = 0;
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
        watchListCounter++;
      }

      if (film.userDetails.alreadyWatched) {
        alreadyWatchedCounter++;
      }

      if (film.userDetails.favorite) {
        favoriteFilmsCounter++;
      }

    });
    return {
      movies: films,
      userDetails:{
        watchList: watchListCounter,
        alreadyWatched: alreadyWatchedCounter,
        favoriteFilms: favoriteFilmsCounter,
      },
    };
  };

  #moviesData = this.generateMovies();

  get moviesData () {
    return this.#moviesData;
  }
}
