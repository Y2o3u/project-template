import { GameModuleType, getViewInfo } from "../../module/get-module";
import {
  Cls,
  Param,
  PickAndFlatten,
  RealGameModuleType,
  ViewList,
} from "../../type/common/game";
import { globally } from "../util/decorator";
import { singleton } from "../util/singleton";

/** ui管理 */
export class UIManager {
  /** 打开一个界面 */
  async open<
    T extends RealGameModuleType<GameModuleType>,
    U extends PickAndFlatten<T, keyof T>,
    K extends ViewList<U>,
    X extends { onInit(...args): void }
  >(viewName: K, ...arg: Param<Cls<U[K], X>>) {
    console.log("打开一个界面");
    let cls = await getViewInfo(viewName as string);
  }

  /** 关闭一个界面 */
  close() {}
}

const ui = singleton(UIManager);
export default ui;
globally("ui", ui);
