import dayjs from 'dayjs';

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

export const FilterType = {
  DEFAULT: 'default',
  WATCHLIST: 'watchlest',
  HISTORY: 'alreadyWatched',
  FAVORITES: 'favorite',
};

export const humanizeFilmReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');
export const humanizeCommentReleaseDate = (date) => dayjs(date).format('YYYY/M/D HH:mm');

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortMoviesDateDown = (movieA, movieB) => {
  const weight = getWeightForNullDate(movieA.filmInfo.release.date, movieB.filmInfo.release.date);
  const differenceInYear = dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date), 'year');
  const differenceInMonth = dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date), 'month');

  if (differenceInYear !== 0) {
    return weight ?? differenceInYear;
  }

  if (differenceInYear === 0 && differenceInMonth !== 0) {
    return weight ?? differenceInMonth;
  }

  if (differenceInYear === 0 && differenceInMonth === 0)  {
    return weight ?? dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date), 'day');
  }


};

export const sortMoviesRatingDown = (movieA, movieB) => movieB.filmInfo.totalRating - movieA.filmInfo.totalRating;

export const sortMostCommentedMoviesDown = (movieA, movieB) => movieB.comments.length - movieA.comments.length;

export const isArraysEqual = (movies, sourcedMovies) => {
  for (let i = 0; i < movies.length; i++) {
    if (movies[i] !== sourcedMovies[i]) {
      return false;
    }
  }
  return true;
};

export const addControlButtons = (watchlist, alreadyWatched, favorite) => {
  let controlButtons = '';

  if (watchlist) {
    controlButtons = `${controlButtons}
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
    `;
  } else {
    controlButtons = `${controlButtons}
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    `;
  }

  if (alreadyWatched) {
    controlButtons = `${controlButtons}
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
    `;
  } else {
    controlButtons = `${controlButtons}
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    `;
  }

  if (favorite) {
    controlButtons = `${controlButtons}
      <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
    `;
  } else {
    controlButtons = `${controlButtons}
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    `;
  }
  return controlButtons;
};
