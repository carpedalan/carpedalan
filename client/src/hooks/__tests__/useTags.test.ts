import { act } from 'react-dom/test-utils';
import { testHook, tick } from '../../testutils';
import useTags, { UseTags } from '../useTags';
import axios from 'axios';

let tagReturn: UseTags;
beforeEach(() => {
  testHook(() => {
    tagReturn = useTags();
  });
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('useTags', () => {
  it('should have an onChange function', () => {
    expect(tagReturn.fetchTags).toBeInstanceOf(Function);
  });

  it('should have correct name', () => {
    expect(tagReturn.tags).toEqual([]);
  });

  it('should setTags if fetch is called', async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: ['a tag'] }),
    );
    await tagReturn.fetchTags();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/v1/tags');
    await tick();
    // expect(tagReturn.tags).toMatchObject(['a tag']);
  });
});
