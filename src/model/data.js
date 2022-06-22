export default class FilmModel {
  #moviesApiService = null;
  #movies = [];
  #moviesData = null;

  constructor(moviesApiService) {
    this.#moviesApiService = moviesApiService;
  }

  #adaptToClient = (movie) =>{
    const adaptedMovie = {...movie,
      filmInfo: {...movie['film_info'],
        alternativeTitle: movie['film_info']['alternative_title'],
        totalRating: movie['film_info']['total_rating'],
        ageRating: movie['film_info']['age_rating'],
        release: {...movie['film_info']['release'],
          releaseCountry: movie['film_info']['release']['release_country'],
        },
      },
      userDetails: {...movie['user_details'],
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
      },
    };

    delete adaptedMovie.filmInfo['total_rating'];
    delete adaptedMovie.filmInfo['age_rating'];
    delete adaptedMovie.filmInfo['alternative_title'];
    delete adaptedMovie.filmInfo.release['release_country'];

    delete adaptedMovie.userDetails['already_watched'];
    delete adaptedMovie.userDetails['watching_date'];

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  };

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
      this.#moviesData = this.#generateDataMovies();
    } catch (err) {
      this.#movies = [];
      this.#moviesData = null;
    }
  };

  updateMovie = async (update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  };

  addComment = async (movie, comment) => {
    try {
      const response = await this.#moviesApiService.addComment(movie, comment);
      const newMovie = this.#adaptToClient(response.movie);
      newMovie.comments = newMovie.comments.concat(response.comments);
      newMovie.comments.splice(0, newMovie.comments.length / 2);
      return newMovie;
    } catch(err) {
      throw new Error('Can\'t add movie');
    }
  };

  deleteComment = async (update, id) => {
    const index = update.comments.findIndex((comment) => comment.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting movie');
    }

    try {
      await this.#moviesApiService.deleteComment(update.comments[index]);
    } catch(err) {
      throw new Error('Can\'t delete movie');
    }
  };

  #generateDataMovies = () => {
    const watchListFilms = [];
    const alreadyWatchedFilms = [];
    const favoriteFilms = [];
    this.#movies.forEach((movie) => {
      this.#moviesApiService.getComments(movie).then((comments) => {
        movie.comments = movie.comments.concat(comments);
        movie.comments.splice(0, movie.comments.length / 2);
      });

      if (movie.userDetails.watchlist) {
        watchListFilms.push(movie.id);
      }

      if (movie.userDetails.alreadyWatched) {
        alreadyWatchedFilms.push(movie.id);
      }

      if (movie.userDetails.favorite) {
        favoriteFilms.push(movie.id);
      }

    });
    return {
      movies: this.#movies,
      userDetails:{
        watchlist: watchListFilms,
        alreadyWatched: alreadyWatchedFilms,
        favoriteFilms: favoriteFilms,
      },
    };
  };

  get moviesData () {
    return this.#moviesData;
  }
}
