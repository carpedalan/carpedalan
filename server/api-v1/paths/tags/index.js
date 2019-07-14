import get from './get';
import post from './post';

export default function(tags) {
  return {
    get: get(tags),
    post: post(tags),
  };
}
