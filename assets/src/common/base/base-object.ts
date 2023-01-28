/**
 * 数据基类
 * 1.引入mobx能力
 * 2.封装timeout能力
 * 3.封装interval能力
 * 4.后续考虑将是否有可能将base-object和base-component合并
 */

import {
  IAutorunOptions,
  IReactionOptions,
  IReactionPublic,
  IWhenOptions,
  Lambda,
} from "mobx";
import { IDisposable } from "../util/disposable";
import { autorun, reaction, when } from "../util/mobx";

export class BaseObject {
  /** 待释放对象 */
  disposableArr: IDisposable[] = [];

  /** 添加到待释放中 */
  addDisposable(disposable: IDisposable) {
    this.disposableArr.push(disposable);
  }

  /** 清除 */
  cleanDisposable(disposable: IDisposable) {
    if (disposable) {
      let idx = this.disposableArr.indexOf(disposable);
      if (idx > -1) {
        this.disposableArr.splice(idx, 1);
      }
      disposable.dispose();
    }
  }

  /**
   * 开启一个计时器
   * @param cb 执行的回调
   * @param delay 秒
   * @returns
   */
  timeout(cb: () => void, delay: number, context = this) {
    if (!cb) return;
    let id = setTimeout(cb.bind(context), delay * 1000);
    let disposeObj = {
      dispose() {
        clearTimeout(id);
      },
    };
    this.addDisposable(disposeObj);
    return;
  }

  /**
   * 开启一个定时器
   * @param cb
   * @param interval 秒
   * @returns
   */
  interval(cb: () => void, interval: number, context = this) {
    if (!cb) return;
    let id = setInterval(cb.bind(context), interval * 1000);
    let disposeObj = {
      dispose() {
        clearInterval(id);
      },
    };
    this.addDisposable(disposeObj);
  }

  /**
   * 自执行函数、自动收集view中使用到的参数值，发生变化自动调用
   * @param view 创建时以及收集的数值变化时生效
   * @param opts
   * @returns
   */
  autorun(
    view: (r: IReactionPublic) => any,
    opts?: IAutorunOptions
  ): IDisposable {
    let disposeObj = {
      dispose: autorun(view, opts),
    };
    this.addDisposable(disposeObj);
    return disposeObj;
  }

  /**
   * autorun的变种，提供更细粒度的控制，且创建时不生效
   * @param expression
   * @param effect 创建时并不立即生效，第一次发生变化时才生效
   * @param opts
   * @returns
   */
  reaction(
    expression: (r: IReactionPublic) => unknown,
    effect: (arg: unknown, prev: unknown, r: IReactionPublic) => void,
    opts?: IReactionOptions
  ) {
    const disposeObj = {
      dispose: reaction(expression, effect, opts),
    };
    return disposeObj;
  }

  /**
   * 当满足条件时，自动执行effect函数
   * @param predicate
   * @param effect
   * @param opts
   * @returns
   */
  when(predicate: () => boolean, effect: Lambda, opts?: IWhenOptions) {
    const disposeObj = {
      dispose: when(predicate, effect, opts),
    };
    return disposeObj;
  }
}
