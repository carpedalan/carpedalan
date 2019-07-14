import get from './get';
import post from './post';

// Arguments processed by swagger paths have to match dependencies BY NAME
export default function(posts) {
  return {
    get: get(posts),
    post: post(posts),
  };
}
