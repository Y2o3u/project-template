import { Component } from "cc";
import { IDisposable, dispose } from "../util/disposable";
import { CountDown, CountDownOptional } from "../component/count-down";
import {
  IAutorunOptions,
  IReactionOptions,
  IReactionPublic,
  IWhenOptions,
  Lambda,
} from "mobx";
import { autorun, reaction, when } from "../util/mobx";
import { emitter } from "../event/event-mgr";
import { eventNames } from "process";
import EventEmitter from "eventemitter3";

/**
 * 基础组件
 * 1. 引入mobx能力
 */
export class BaseComponent extends Component {
  /** 待释放对象 */
  disposableArr: IDisposable[] = [];
  constructor() {
    super();
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
   * 启动一个倒计时的计时器，计时器每隔一定时间执行一次，到达某个目标后自动停止
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

  /** 事件监听 */
  on<T extends EventObjectParam<any>>(
    event: T,
    listener: (...args: PickDep<T>) => void,
    context?
  ): void;
  on(event: string, ...args: any): void;
  on(...args) {
    let curEmitter: EventEmitter;
    let event: string;
    let listener: () => any;
    let context;
    if (args[0]["_kind"] == "e") {
      curEmitter = args[0]["emitter"];
      event = args[0].event;
      listener = args[1];
      context = args[2];
    } else {
      curEmitter = emitter;
      event = args[0];
      listener = args[1];
      context = args[2];
    }
    curEmitter.on(event, listener, context);
    let disposeObj = {
      dispose() {
        curEmitter.off(event, listener, this);
      },
    };
    this.addDisposable(disposeObj);
  }

  /**
   * 事件发送
   * @param event
   * @param arg
   * this.emit(E.pet.updateName, 'name')
   */
  emit<T extends EventObjectParam<any>>(event: T, ...args: PickDep<T>): void;
  emit(event: string, ...args: any): void;
  emit(...args: any): void {
    let curEmitter: EventEmitter;
    let event: string;
    let allArgs: any[];
    if ((args[0]["_kind"] = "e")) {
      curEmitter = args[0].emitter;
      event = args[0].event;
      allArgs = args.slice(1);
    } else {
      curEmitter = emitter;
      event = args[0];
      allArgs = args.slice(1);
    }
    curEmitter.emit(event, ...allArgs);
  }

  /** 释放 */
  onDestroy() {
    dispose(this.disposableArr);
  }
}
