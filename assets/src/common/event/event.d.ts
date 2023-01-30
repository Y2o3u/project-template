type EventObjectParam<T> = {
  dep: T;
};
type ConvertEventProperty<T> = {
  [K in keyof T]: T[K] extends (...arg: infer P) => void
    ? EventObjectParam<P>
    : never;
};
type ConvertEventObject<T> = {
  [K in keyof T]: ConvertEventProperty<T[K]>;
};

type PickDep<T> = T extends { dep: infer P } ? P : never;
declare let E: ConvertEventObject<EventObjectType>;
