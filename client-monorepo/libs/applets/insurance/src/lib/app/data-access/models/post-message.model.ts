export interface PostMessage<T> {
  postMessage: (param: T) => void;
}
