interface Mock<T = any, Y extends any[] = any> extends Function, MockInstance<T, Y> {
  send: any;
    new (...args: Y): T;
    (...args: Y): T;
}
