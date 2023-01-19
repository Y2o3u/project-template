import { _decorator } from "cc";
import dayjs from "dayjs";
import { PetData } from "../../data/pet-data";
import { View } from "../../common/base/view";
import { GData, getCommonModule } from "../../module/get-module";
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends View {
  async start() {
    // 使用dayjs，避免一个时间戳调试时看不出具体日期
    let formatDate = dayjs().format("YYYY/MM/DD");
    console.log("dayjs", formatDate);
    let now = dayjs(Date.now());
    console.log("dayjs_now", now);

    // 数据模块使用,通过GData访问
    console.log(GData.Pet.lv);
    console.log(GData.User.nickName);

    // 使用interval
    this.interval(() => {
      console.log("this is interval");
    }, 10);

    // 使用timeout
    this.timeout(() => {
      console.log("this is timeout");
    }, 1);

    // 使用countdown
    this.countDown((left) => {
      console.log("剩余倒计时", left);
    }, 100);
  }

  update(deltaTime: number) {}
}
