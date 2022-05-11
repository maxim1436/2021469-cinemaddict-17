import dayjs from 'dayjs';

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
