import { _decorator } from "cc";
import { View } from "../../common/base/view";
import { mobx } from "../../common/util/mobx";
import { GData } from "../../module/get-module";
import ui from "../../common/ui/ui-mgr";

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
    this.on(E.pet.updateName, this.updateStr, this);
    this.emit(E.pet.updateName, "yyyy");
    // this.when(
    //   () => this.data.lv > 10,
    //   () => {
    //     console.log(this.data.lv);
    //   }
    // );

    // petData.lv = 100;
    // console.log(E.pet);
    // console.log(E.pet.updateName);
    // this.emit(E.pet.updateName, "1");
  }

  update(deltaTime: number) {}

  updateStr(name: string) {
    console.log("update pet name", name);
  }
}
