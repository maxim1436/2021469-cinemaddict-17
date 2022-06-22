import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addComment = async (film, comment) => {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };

  getComments(film) {
    return this._load({url: `comments/${film.id}`})
      .then(ApiService.parseResponse);
  }

  #adaptToServer = (movie) => {
    const commentsIdArray = [];
    movie.comments.forEach((comment) => {
      commentsIdArray.push(comment.id);
    });
    const adaptedMovie = {...movie,
      comments : commentsIdArray,
      'film_info': {...movie.filmInfo,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'total_rating': movie.filmInfo.totalRating,
        'age_rating': movie.filmInfo.ageRating,
        release: {...movie.filmInfo.release,
          'release_country': movie.filmInfo.release.releaseCountry,
        },
      },
      'user_details': {...movie.userDetails,
        'already_watched': movie.userDetails.alreadyWatched,
        'watching_date': movie.userDetails.watchingDate,
      },
    };

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.film_info.alternativeTitle;
    delete adaptedMovie.film_info.totalRating;
    delete adaptedMovie.film_info.ageRating;
    delete adaptedMovie.film_info.release.releaseCountry;

    delete adaptedMovie.userDetails;
    delete adaptedMovie.user_details.alreadyWatched;
    delete adaptedMovie.user_details.watchingDate;

    return adaptedMovie;
  };
}
