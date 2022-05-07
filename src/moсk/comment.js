import {getNonRepeatingNumber, getRandomElementOfArray} from '../utils';

const commentsIndexArray = [];

const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

export const generateComment = () => ({
  'id': `${getNonRepeatingNumber(commentsIndexArray, 0, 100)}`,
  'author': 'Ilya O\'Reilly',
  'comment': 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'date': '2019-05-11T16:12:32.554Z',
  'emotion': getRandomElementOfArray(emotions),
});
