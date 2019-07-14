import get from './get';

export default function(posts) {
  return {
    get: get(posts),
  };
}
