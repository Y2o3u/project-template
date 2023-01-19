import { singleton } from "../util/singleton";
import { BaseObject } from "./base-object";

export type Type<T> = { new (...arg): T };

/** 数据基类 */
export abstract class Data<T = any> extends BaseObject {
  /** 数据初始化 */
  protected init() {}

  /** 获取单例 */
  static getInst<T>(this: Type<T>): T {
    const instance = singleton(this, (i: any) => i.init());
    return instance;
  }
}
