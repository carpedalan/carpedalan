import { UserContext } from 'providers/User';
import { useContext } from 'react';

export { User } from 'providers/User';

export default () => useContext(UserContext);
