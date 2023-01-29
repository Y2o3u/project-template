import { View } from "../../common/base/view";

export interface IShowWidgetOpts {
  stackTopMode: boolean;
}

type Cls2<T> = T extends { new (): infer A } ? A : never;

type ModuleType = { [key: string]: () => Promise<any> };

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>;

type Cls<T, U> = T extends { new (): infer A }
  ? A extends U
    ? A
    : never
  : never;

type Param<T extends { onInit(...arg): void }> = T extends {
  onInit(...arg: infer P): void;
}
  ? P
  : never;

type RealGameModuleType<T> = {
  [K in keyof T]: PromiseModule<T[K]>;
};

export interface IShowWidgetFunc<M extends ModuleType> {
  <
    T extends RealGameModuleType<M>,
    U extends PickAndFlatten<T, keyof T>,
    K extends ViewList<U>,
    X extends { onInit(...args): void }
  >(
    viewName: K,
    ...arg: Param<Cls<U[K], X>>
  ): Promise<Cls2<U[K]> | undefined>;
}

export type PromiseModule<T> = T extends () => Promise<infer V> ? V : never;

export type ViewList<T> = {
  [K in keyof T]: T[K] extends { new (): View } ? K : never;
}[keyof T];
