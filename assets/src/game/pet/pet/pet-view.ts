import { View } from "../../../common/base/view";

/** 宠物界面 */
export class PetView extends View {
  /** 界面信息 */
  static viewInfo = {
    path: "view/pet/pet-view/pet-view.prefab",
  };

  /** 数据准备 */
  async prepare() {
    return Promise.resolve(1);
  }

  onInit(lv?: number, name?: string) {
    console.log(lv);
    console.log(name);
  }
}
