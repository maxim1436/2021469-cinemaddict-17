import {getRandomInteger, getRandomFraction, getNonRepeatingNumber, getRandomElementOfArray} from '../utils';
import { nanoid } from 'nanoid';

const FILM_TITLES = [
  'Побег из Шоушенка',
  'Крёстный отец',
  'Тёмный рыцарь',
  'Властелин колец: Возвращение короля',
  'Бойцовский клуб'
];

const FILM_POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg'
];

const FILM_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
];

const TRUE_OR_FALSE = [
  true,
  false
];

export const generateFilm = () => {
  const commentsIndexArray = [];

  for(let i = 0; i < getRandomInteger(0, 10); i++) {
    getNonRepeatingNumber(commentsIndexArray, 0, 20);
  }
  return {
    'id': `${nanoid()}`,
    'comments': commentsIndexArray.map(String),
    'filmInfo': {
      'title': getRandomElementOfArray(FILM_TITLES),
      'alternativeTitle': 'Laziness Who Sold Themselves',
      'totalRating': getRandomFraction(0, 10, 1),
      'poster': `${getRandomElementOfArray(FILM_POSTERS)}`,
      'ageRating': getRandomInteger(0, 21),
      'director': 'Tom Ford',
      'writers': [
        'Takeshi Kitano'
      ],
      'actors': [
        'Morgan Freeman'
      ],
      'release': {
        'date': `${new Date(getRandomInteger(1, 10000) * getRandomInteger(1, 10000) * getRandomInteger(1, 10000)).toISOString()}`,
        'releaseCountry': 'Finland'
      },
      'runTime': getRandomInteger (20, 120),
      'genre': [
        'Comedy',
        'Cartoon'
      ],
      'description': `${getRandomElementOfArray(FILM_DESCRIPTIONS)}`
    },
    'userDetails': {
      'watchlist': getRandomElementOfArray(TRUE_OR_FALSE),
      'alreadyWatched': getRandomElementOfArray(TRUE_OR_FALSE),
      'watchingDate': `${getRandomInteger(2000, 2022)}-0${getRandomInteger(1, 9)}-${getRandomInteger(10, 31)}T16:12:32.554Z`,
      'favorite': getRandomElementOfArray(TRUE_OR_FALSE)
    }
  };
};
