/**
 * 数据基类
 * 1.引入mobx能力
 * 2.封装timeOut能力
 * 3.封装interval能力
 */

import { IDisposable } from "../util/disposable";

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

  /** 开启一个自动监听 */
  autoRun(view: (r) => any, opts?) {}

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
}
