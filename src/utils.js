import dayjs from 'dayjs';

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

export const humanizeFilmReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');
export const humanizeCommentReleaseDate = (date) => dayjs(date).format('YYYY/M/D HH:mm');

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFraction = (min, max, rate) => {
  if ((max < 0) || (min < 0)) {
    throw RangeError('The argument must not be negative');
  }
  const a = Math.random();
  const result = (max >= min) ?
    ((a * (max - min)) + min).toFixed(rate) :
    ((a * (min - max)) + max).toFixed(rate);
  return parseFloat(result);
};

export const getNonRepeatingNumber = (array, min, max) => {
  const elem = getRandomInteger(min, max);
  if (array.includes(elem) === false) {
    array.push(elem);
    return elem;
  } else {
    return getNonRepeatingNumber(array, min, max);
  }
};

export const getRandomElementOfArray = (array) => array[getRandomInteger(0, array.length - 1)];

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
