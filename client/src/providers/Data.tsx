import { PostsWithTagsWithFakes } from 'hooks/usePosts';
import * as React from 'react';
import keyBy from 'lodash/keyBy';
import debug from 'debug';

const log = debug('providers:Data');

const { createContext, Children, useState, useReducer } = React;
export interface Data {
  posts: PostsWithTagsWithFakes[];
  tags: Paths.GetTags.Responses.$200;
  postsById: {
    [uuid: string]: PostsWithTagsWithFakes;
  };
}
const data: Data = {
  posts: [],
  tags: [],
  postsById: {},
};
type SetPosts = (posts: PostsWithTagsWithFakes[]) => void;
type AddPosts = (posts: PostsWithTagsWithFakes[]) => void;
type SetTags = (posts: Paths.GetTags.Responses.$200) => void;
export interface DataContextI {
  data: Data;
  setPosts: SetPosts;
  setTags: SetTags;
  addPosts: AddPosts;
}
export const DataContext = createContext<DataContextI>({
  data,
  setPosts: () => {},
  setTags: () => {},
  addPosts: () => {},
});

type Action =
  | { type: 'set posts'; payload: PostsWithTagsWithFakes[] }
  | { type: 'add posts'; payload: PostsWithTagsWithFakes[] }
  | {
      type: 'set tags';
      payload: Paths.GetTags.Responses.$200;
    };

function reducer(state: Data, action: Action): Data {
  console.groupCollapsed(
    `%c ${action.type}`,
    'background: green; color: white;',
  );
  log(`%c Action: "${action.type}"`, 'background: green;', action);
  let newState = state;
  switch (action.type) {
    case 'set posts':
      newState = {
        ...state,
        posts: action.payload,
        postsById: {
          ...state.postsById,
          ...keyBy(action.payload, 'id'),
        },
      };
      break;
    case 'add posts': {
      newState = {
        ...state,
        postsById: { ...state.postsById, ...keyBy(action.payload, 'id') },
      };
      break;
    }
    case 'set tags':
      newState = {
        ...state,
        tags: action.payload,
      };
      break;
    default: {
      newState = state;
      break;
    }
  }
  log('%c New State', 'background: green', newState);
  console.groupEnd();
  return newState;
}

export const DataConsumer = DataContext.Consumer;

export const DataProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, data);

  const setPosts = (posts: PostsWithTagsWithFakes[]) =>
    dispatch({ type: 'set posts', payload: posts });

  const addPosts = (posts: PostsWithTagsWithFakes[]) =>
    dispatch({ type: 'set posts', payload: posts });

  const setTags = (tags: Paths.GetTags.Responses.$200) => {
    dispatch({ type: 'set tags', payload: tags });
  };

  const value: DataContextI = {
    setTags,
    setPosts,
    addPosts,
    data: state,
  };
  log('value', value);
  return (
    <DataContext.Provider value={value}>
      {Children.only(children)}
    </DataContext.Provider>
  );
};
