import { Component } from "cc";
import { IDisposable, dispose } from "../util/disposable";
import * as mobx from "mobx";
import { BaseObject } from "./base-object";
import { CountDown, CountDownOptional } from "../component/count-down";

/**
 * 基础组件
 * 1. 引入mobx能力
 */
export class BaseComponent extends Component {
  /** 待释放对象 */
  disposableArr: IDisposable[] = [];
  constructor() {
    super();
    // mobx.default.makeObservable(this);
  }

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

  /**启动一个倒计时的计时器，计时器每隔一定时间执行一次，到达某个目标后自动停止
   * @param callback 计时器每次执行的回调函数
   * @param start 计数的数字开始的大小
   * @param optional 可选参数
   * - 倒计时的计时器的默认行为为：每隔1秒执行一次回调函数，每次计数的数字-1，减到0的时候则结束计时器
   */
  countDown(
    callback: (left: number) => void,
    start: number,
    optional: CountDownOptional = {}
  ) {
    return new CountDown(this, callback, start, optional);
  }

  /** 释放 */
  onDestroy() {
    dispose(this.disposableArr);
  }
}
