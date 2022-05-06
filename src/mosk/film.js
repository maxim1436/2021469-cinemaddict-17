import {getRandomInteger, getRandomFraction} from '../utils';

const FILM_TITLE = [
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

const FILM_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
];

export const generateFilm = () => ({
  'id': '0',
  'comments': [
    `${getRandomInteger(0, 5)}`
  ],
  'filmInfo': {
    'title': FILM_TITLE[getRandomInteger(0, FILM_TITLE.length - 1)],
    'alternativeTitle': 'Laziness Who Sold Themselves',
    'totalRating': getRandomFraction(0, 10, 1),
    'poster': `${FILM_POSTERS[getRandomInteger(0, FILM_POSTERS.length - 1)]}`,
    'ageRating': getRandomInteger(0, 21),
    'director': 'Tom Ford',
    'writers': [
      'Takeshi Kitano'
    ],
    'actors': [
      'Morgan Freeman'
    ],
    'release': {
      'date': '2019-05-11T00:00:00.000Z',
      'releaseCountry': 'Finland'
    },
    'runTime': getRandomInteger (20, 120),
    'genre': [
      'Comedy',
      'Cartoon'
    ],
    'description': `${FILM_DESCRIPTION[getRandomInteger(0, FILM_DESCRIPTION.length - 1)]}`
  },
  'userDetails': {
    'watchlist': false,
    'alreadyWatched': true,
    'watchingDate': '2019-04-12T16:12:32.554Z',
    'favorite': false
  }
});
