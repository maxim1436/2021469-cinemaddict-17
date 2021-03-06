import { humanizeFilmReleaseDate, humanizeCommentReleaseDate, addControlButtons } from '../utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { nanoid } from 'nanoid';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import he from 'he';

const MINUTES_IN_HOUR = 60;
const DELAY = 1000;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const UserActionType = {
  ADD_COMMENT: 'add-comment',
  DELETE_COMMENT: 'delete-comment',
};

const createPopupTemplate = (card) => {
  const {
    choosenEmoji,
    CommentText,
    isDisabled,
    filmInfo: {
      alternativeTitle,
      title,
      totalRating,
      runtime,
      poster,
      description,
      director,
      writers,
      actors,
      release: {
        date,
        releaseCountry
      },
      genre,
      ageRating
    },
    comments,
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    }
  } = card;

  const addRuntime = () => {
    const filmHoursAmount = Math.floor(runtime / MINUTES_IN_HOUR);
    const filmMinutesAmount = runtime - (MINUTES_IN_HOUR * Math.floor(runtime / MINUTES_IN_HOUR));
    if (filmHoursAmount <= 0) {
      return (`${filmMinutesAmount}m`);
    } else {
      return (`${filmHoursAmount}h ${filmMinutesAmount}m`);
    }
  };

  const addGenreElement = () => {
    let genreName = '';
    for (const genreNameElement of genre) {
      genreName = `${genreName}<span class="film-details__genre">${genreNameElement}</span>`;
    }
    return genreName;
  };

  const addCommentElement = () => {
    let commentElement = '';
    for (const elementOfCommentsArray of comments) {
      commentElement = `${commentElement}<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${elementOfCommentsArray.emotion}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(elementOfCommentsArray.comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${elementOfCommentsArray.author}</span>
              <span class="film-details__comment-day">${humanizeCommentReleaseDate(elementOfCommentsArray.date)}</span>
              <button class="film-details__comment-delete" id="${elementOfCommentsArray.id}" ${isDisabled ? 'disabled' : ''}>${isDisabled ? 'Deleting...' : 'Delete'}</button>
            </p>
          </div>
        </li>`;
    }
    return commentElement;
  };

  return (`
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src=${poster} alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join()}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join()}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeFilmReleaseDate(date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${addRuntime()}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${addGenreElement()}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${addControlButtons(watchlist, alreadyWatched, favorite)}
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${addCommentElement()}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${CommentText ? CommentText : ''}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${choosenEmoji === 'smile' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${choosenEmoji === 'sleeping' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${choosenEmoji === 'puke' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${choosenEmoji === 'angry' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `);
};

export default class PopupView extends AbstractStatefulView{
  #commentTextElement = null;
  #choosenEmoji = null;
  #emojiCollection = null;
  #deleteButtonsCollection = null;
  #reinitMovieCard = null;
  #renderMostCommentedMovies = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor (card, reinitMovieCard, renderMostCommentedMovies) {
    super();
    this._state = this.#parseCommentInfoToState(card);
    this.#setInnerHandlers();
    this.#reinitMovieCard = reinitMovieCard;
    this.#renderMostCommentedMovies = renderMostCommentedMovies;
  }

  #setInnerHandlers = () => {
    this.#emojiCollection = this.element.querySelectorAll('input');
    this.#commentTextElement =  this.element.querySelector('.film-details__comment-input');
    this.#deleteButtonsCollection = this.element.querySelectorAll('.film-details__comment-delete');

    for (const elem of this.#emojiCollection) {
      elem.addEventListener('change',this.#adCommentEmojiToPopupView);
    }

    this.#commentTextElement.addEventListener('input', this.#addCommentTextToPopupView);
  };

  setHandleAddCommentToPopupKeydown = (callback) => {
    this._callback.handleAddCommentToPopupKeydown = callback;
    document.addEventListener('keydown', this.#handleAddCommentToPopupKeydown);
  };

  #handleAddCommentToPopupKeydown = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();
      this.#uiBlocker.block();
      this._callback.handleAddCommentToPopupKeydown(this._state, {comment: this._state.CommentText, emotion: this._state.choosenEmoji})
        .then((movie) => {
          if (movie) {
            this._state.choosenEmoji = null;
            this._state.CommentText = null;
            this._state.isDisabled = false;
            this.updateElement(movie);
            this.#renderMostCommentedMovies(movie);
            this.#reinitMovieCard(movie);
            this.#uiBlocker.unblock();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          this.element.querySelector('.film-details__inner').classList.add('shake');
          this.#uiBlocker.unblock();
        });

    }
  };

  setHandleDeleteCommentInPopupClick = (callback) => {
    this._callback.handleDeleteCommentInPopupClick = callback;
    for (const button of this.#deleteButtonsCollection) {
      button.addEventListener('click', this.#handleDeleteCommentInPopupClick);
    }
  };

  #handleDeleteCommentInPopupClick = (evt) => {
    evt.preventDefault();
    this._state.isDisabled = true;
    this.updateElement(this._state);
    this._callback.handleDeleteCommentInPopupClick(this._state , evt.target.id).then(() => {
      this._state.comments = this._state.comments.filter((comment) => comment.id !== evt.target.id);
      const movie = this.#parseStateToMoie(this._state, UserActionType.DELETE_COMMENT);
      this._state.choosenEmoji = null;
      this._state.CommentText = null;
      this._state.isDisabled = false;
      this.updateElement(movie);
      this.#renderMostCommentedMovies(movie);
      this.#reinitMovieCard(movie);
    }).catch(() => {
      this.element.querySelector('.film-details__inner').classList.add('shake');
      setTimeout(() => {
        this._state.isDisabled = false;
        this.updateElement(this._state);
      }, DELAY);
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setHandleDeleteCommentInPopupClick(this._callback.handleDeleteCommentInPopupClick);
    this.setHandleAddCommentToPopupKeydown(this._callback.handleAddCommentToPopupKeydown);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setClosePopupClickHandler(this._callback.closePopupClick);
  };

  #adCommentEmojiToPopupView = (evt) => {
    evt.preventDefault();
    this._state.choosenEmoji = evt.target.value;
    const choosenEmojiContainer = this.element.querySelector('.film-details__add-emoji-label');
    choosenEmojiContainer.innerHTML = `<img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji-smile">`;
  };

  #addCommentTextToPopupView = (evt) => {
    evt.preventDefault();
    this._setState({
      CommentText: evt.target.value,
    });
  };

  get template () {
    return createPopupTemplate(this._state);
  }

  #parseCommentInfoToState = (movie) => ({...movie,
    choosenEmoji: this.#choosenEmoji !== null,
    CommentText: this.#commentTextElement !== null,
    isDisabled: false,
  });

  #parseStateToMoie = (state, userActionType) => {

    if (userActionType === UserActionType.ADD_COMMENT) {
      const movie = {...state};

      const newComment = {
        'id' : `${nanoid()}`,
        'author': 'Ilya O\'Reilly',
        'comment': movie.CommentText,
        'date': `${new Date().toISOString()}`,
        'emotion': movie.choosenEmoji,
      };
      movie.comments.push(newComment);

      delete movie.choosenEmoji;
      delete movie.CommentText;
      delete movie.isDisabled;

      return movie;
    } else {
      const movie = {...state};

      delete movie.choosenEmoji;
      delete movie.CommentText;
      delete movie.isDisabled;

      return movie;
    }
  };

  setClosePopupClickHandler = (callback) => {
    this._callback.closePopupClick = callback;
    return this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  };

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopupClick(this.element, this._state);
  };

  setClosePopupKeydownHandler = (callback) => {
    this._callback.closePopupKeydown = callback;
    return document.addEventListener('keydown', this.#closePopupKeydownHandler);
  };

  #closePopupKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      if (this._callback.closePopupKeydown) {
        this._callback.closePopupKeydown(this.element, this._state);
      }
      delete this._callback.addCommentEnterClick;
      delete this._callback.closePopupKeydown;
      document.removeEventListener('keydown', this.#closePopupKeydownHandler);
      document.removeEventListener('keydown', this.#handleAddCommentToPopupKeydown);
      document.removeEventListener('click', this.#closePopupClickHandler);
    }
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    return this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#FavoriteClickHandler);
  };

  #FavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(this.element);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    return this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHadler);
  };

  #watchlistClickHadler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(this.element);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    return this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick(this.element);
  };
}
