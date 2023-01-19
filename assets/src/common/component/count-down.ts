import { Component, director } from "cc";

/**倒计时计时器的可选参数 */
export type CountDownOptional = {
  /**结束时候的目标数字，默认为0 */
  end?: number;
  /**计时器执行的间隔，默认为1，单位：秒 */
  interval?: number;
  /**每次计时器执行，剩余数字变化的量，默认为-1 */
  change?: number;
  /**计时器执行的总时长，单位：秒
   * - 如果设置了time，则会动态计算change
   * - 即，change既不会采用默认值-1，也不会采用设置的值（此时一般不用设置change）
   */
  time?: number;
  /**当前计时器的唯一名字，
   * - 定义了唯一名字的计时器，启动时候会取消当前环境下（this）同名的计时器的运行
   */
  uniqueName?: PropertyKey;
  /**如果有同名计时器在运行，则当前计时器是否从已有的进度开始，默认false，
   * - 如果为true，则会从当前剩余数字变化到end，即将start重置为已有计时器的left
   */
  isStartCurrent?: boolean;
  /**数字变化到目标数字，计时器结束时候的回调函数 */
  onEnd?: () => void;
};

/**启动一个倒计时的计时器，计时器每隔一定时间执行一次，到达某个目标后自动停止 */
export class CountDown {
  /**用来记录所有的计时器信息 */
  static allCountDown: Map<Component, Map<PropertyKey, CountDown>> = new Map();

  /**当前计时器所属的组件 */
  private component: Component = null;
  /**当前剩余的数字 */
  private left = 0;
  /**计时器结束时候的目标数字 */
  private end = 0;
  /**计时器调用的业务回调函数 */
  private callback: Function = null;

  /**当前计时器对应的回调函数 */
  private cb: Function = null;

  /**当前计时器是否已经完成 */
  private isFinish = false;

  /**当前计时器是否已经完成 */
  get IsFinish() {
    return this.isFinish;
  }

  /**启动一个倒计时的计时器，计时器每隔一定时间执行一次，到达某个目标后自动停止
   * @param component 计时器依赖的组件
   * @param callback 计时器每次执行的回调函数
   * @param start 计数的数字开始的大小
   * @param optional 可选参数
   * - 倒计时的计时器的默认行为为：每隔1秒执行一次回调函数，每次计数的数字-1，减到0的时候则结束计时器
   */
  constructor(
    component: Component,
    callback: (left: number) => void,
    start: number,
    optional: CountDownOptional = {}
  ) {
    //参数默认处理
    let {
      end = 0,
      interval = 1,
      change = -1,
      time,
      uniqueName,
      isStartCurrent = false,
      onEnd,
    } = optional;
    //如果设置了time，则动态计算change
    if (time) {
      //计算要执行的次数
      let times = Math.round(time / interval);
      //根据开始，结束数字以及执行次数，动态计算每次执行的变化量change
      change = (end - start) / times;
    }
    //如果定义了uniqueName，则记录此计时器，同时查找同名计时器，如果找到了，则取消该计时器，
    if (uniqueName) {
      //获取当前组件下的计时器信息
      let componentCountDown = CountDown.allCountDown.get(component);
      if (!componentCountDown) {
        componentCountDown = new Map();
        CountDown.allCountDown.set(component, componentCountDown);
      }
      //查找是否有同名计时器
      let uniqueNameCountDown = componentCountDown.get(uniqueName);
      if (uniqueNameCountDown) {
        //如果 isStartCurrent 为true，则会从当前剩余数字变化到end，即将start重置为已有计时器的left
        if (isStartCurrent) {
          start = uniqueNameCountDown.left;
        }
        uniqueNameCountDown.cancel.call(uniqueNameCountDown);
      }
      //记录计时器信息
      componentCountDown.set(uniqueName, this);
    }
    //记录参数
    this.component = component;
    this.left = start;
    this.end = end;
    this.callback = callback;
    //结束要做的事
    let finish = () => {
      this.isFinish = true;
      this.callCallBack(end);
      onEnd && onEnd.apply(component);
      //取消计时器
      component.unschedule(this.cb);
      //删除记录
      if (uniqueName) {
        CountDown.allCountDown.get(component).delete(uniqueName);
      }
    };
    //定义内部回调函数
    this.cb = () => {
      this.left += change;
      this.callCallBack(this.left);
      if (change < 0) {
        if (this.left <= end) {
          finish();
        }
      } else {
        if (this.left >= end) {
          finish();
        }
      }
    };
    //首先执行一遍回调函数
    this.callCallBack(this.left);
    //开始一个计时器
    component.schedule(this.cb, interval);
  }

  /**调用一次回调函数 */
  private callCallBack(left: number) {
    let { component, callback } = this;
    callback.call(component, left);
  }

  /**取消当前的计时器，
   * @param isDirect 是否直接取消计时器，默认false，表示取消计时器后，如果当前计时器还未停止，则还会用目标数字end调用一遍回调函数
   */
  cancel(isDirect = false) {
    this.component.unschedule(this.cb);
    if (!isDirect && !this.isFinish) {
      this.isFinish = true;
      this.setLeft(this.end);
    }
  }

  /**设置当前剩余的数字，并且调用一遍回调函数 */
  setLeft(left: number) {
    this.left = left;
    this.callCallBack(this.left);
  }

  /**暂停当前的计时器 */
  pause() {
    director.getScheduler().pauseTarget(this.component);
  }

  /**恢复当前的计时器 */
  resume() {
    director.getScheduler().resumeTarget(this.component);
  }
}
