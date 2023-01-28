import { _decorator } from "cc";
import { View } from "../../common/base/view";
import { mobx } from "../../common/util/mobx";
import { GData } from "../../module/get-module";

const { ccclass, property } = _decorator;

export interface testData {
  lv: number;
}

@ccclass("Test")
export class Test extends View {
  start() {
    let petData = GData.Pet.cache;
    this.autorun(() => {
      console.log(petData.lv);
    });

    // this.when(
    //   () => this.data.lv > 10,
    //   () => {
    //     console.log(this.data.lv);
    //   }
    // );

    petData.lv = 100;
  }

  update(deltaTime: number) {}
}
