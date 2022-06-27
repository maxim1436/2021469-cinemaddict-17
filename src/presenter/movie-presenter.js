import { render, replace, remove } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';

export default class MoviePresenter {
  #movieComponent = null;
  #moviesListContainer = null;
  #changeData = null;
  #movie = null;
  #closePrevOpenedPopup = null;
  #addCommentToServer = null;
  #deleteCommentToServer = null;
  #renderMostCommentedMovies = null;

  constructor (moviesListContainer, siteBodyElement, changeData, closePrevOpenedPopup, addCommentToServer, deleteCommentToServer, renderMostCommentedMovies) {
    this.siteBodyElement = siteBodyElement;
    this.#moviesListContainer = moviesListContainer;
    this.#changeData = changeData;
    this.#closePrevOpenedPopup = closePrevOpenedPopup;
    this.#addCommentToServer = addCommentToServer;
    this.#deleteCommentToServer = deleteCommentToServer;
    this.#renderMostCommentedMovies = renderMostCommentedMovies;
  }

  #handleClosePopup = (popupMovieElement, popupState) => {
    popupMovieElement.remove();
    this.siteBodyElement.classList.remove('hide-overflow');
    this.#movie = popupState;
    this.init(this.#movie);
  };

  #hadleOpenPopupClick = (movie) => {
    this.siteBodyElement.classList.add('hide-overflow');

    this.#closePrevOpenedPopup();

    const popupMovie = new PopupView(movie, this.init, this.#renderMostCommentedMovies);
    render(popupMovie, this.siteBodyElement);

    popupMovie.setHandleDeleteCommentInPopupClick(this.#deleteCommentToServer);
    popupMovie.setHandleAddCommentToPopupKeydown(this.#addCommentToServer);
    popupMovie.setClosePopupKeydownHandler(this.#handleClosePopup);
    popupMovie.setClosePopupClickHandler(this.#handleClosePopup);
    popupMovie.setFavoriteClickHandler(this.#handleFavoriteButtonClick);
    popupMovie.setWatchlistClickHandler(this.#handleWatchlistButtonClick);
    popupMovie.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedButtonClick);
  };

  #handleFavoriteButtonClick = (elem) => {
    const propertyBeforeUpdate = {
      userDetails: {
        favorite: true,
        watchlist: this.#movie.userDetails.watchlist,
        alreadyWatched: this.#movie.userDetails.alreadyWatched,
      }
    };
    const movieFavoriteButton = elem.querySelector('.film-card__controls-item--favorite');
    if(movieFavoriteButton.classList.contains('film-card__controls-item--active')) {
      movieFavoriteButton.classList.remove('film-card__controls-item--active');
      this.#movie.userDetails.favorite = false;
    } else {
      movieFavoriteButton.classList.add('film-card__controls-item--active');
      this.#movie.userDetails.favorite = true;
      propertyBeforeUpdate.userDetails.favorite = false;
    }
    this.init(this.#movie);
    this.#changeData(this.#movie, propertyBeforeUpdate);
  };

  #handleWatchlistButtonClick = (elem) => {
    const propertyBeforeUpdate = {
      userDetails: {
        favorite: this.#movie.userDetails.favorite,
        watchlist: true,
        alreadyWatched: this.#movie.userDetails.alreadyWatched,
      }
    };
    const movieWatchlistButton = elem.querySelector('.film-card__controls-item--add-to-watchlist');
    if(movieWatchlistButton.classList.contains('film-card__controls-item--active')) {
      movieWatchlistButton.classList.remove('film-card__controls-item--active');
      this.#movie.userDetails.watchlist = false;
    } else {
      movieWatchlistButton.classList.add('film-card__controls-item--active');
      this.#movie.userDetails.watchlist = true;
      propertyBeforeUpdate.userDetails.watchlist = false;
    }
    this.init(this.#movie);
    this.#changeData(this.#movie, propertyBeforeUpdate);
  };

  #handleAlreadyWatchedButtonClick = (elem) => {
    const propertyBeforeUpdate = {
      userDetails: {
        favorite: this.#movie.userDetails.favorite,
        watchlist: this.#movie.userDetails.watchlist,
        alreadyWatched: true,
      }
    };
    const movieAlreadyWatchedButton = elem.querySelector('.film-card__controls-item--mark-as-watched');
    if(movieAlreadyWatchedButton.classList.contains('film-card__controls-item--active')) {
      movieAlreadyWatchedButton.classList.remove('film-card__controls-item--active');
      this.#movie.userDetails.alreadyWatched = false;
    } else {
      movieAlreadyWatchedButton.classList.add('film-card__controls-item--active');
      this.#movie.userDetails.alreadyWatched = true;
      propertyBeforeUpdate.userDetails.alreadyWatched = false;
    }
    this.init(this.#movie);
    this.#changeData(this.#movie, propertyBeforeUpdate);
  };

  destroy = () => {
    remove(this.#movieComponent);
  };

  init = (movie) => {
    this.#movie = movie;
    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmCardView(movie);

    this.#movieComponent.setOpenPopupClickHandler(this.#hadleOpenPopupClick, movie);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteButtonClick);
    this.#movieComponent.setWatchlistClickHandler(this.#handleWatchlistButtonClick);
    this.#movieComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedButtonClick);

    if (prevMovieComponent === null) {
      return(render(this.#movieComponent, this.#moviesListContainer));
    } else {
      replace(this.#movieComponent, prevMovieComponent);
    }
    remove(prevMovieComponent);
  };
}
