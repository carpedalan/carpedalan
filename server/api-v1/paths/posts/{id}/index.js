import get from './get';
import patch from './patch';
import del from './delete';

export default function(posts) {
  return {
    get: get(posts),
    patch: patch(posts),
    delete: del(posts),
  };
}
