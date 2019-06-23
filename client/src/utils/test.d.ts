declare namespace jest {
  interface Matchers<R> {
    toHaveTextContent: (htmlElement: string) => object;
    toBeInTheDOM: () => void;
  }

  interface Expect {
    toHaveTextContent: (htmlElement: string) => object;
    toBeInTheDOM: () => void;
  }
}
declare module 'react-testing-library';