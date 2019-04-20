import del from './delete';
import patch from './patch';

export default function(posts) {
  return {
    delete: del(posts),
    patch: patch(posts),
  };
}
