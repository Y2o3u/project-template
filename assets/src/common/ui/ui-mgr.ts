import { GameModuleType, getViewInfo } from "../../module/get-module";
import {
  Cls,
  Param,
  PickAndFlatten,
  RealGameModuleType,
  ViewList,
} from "../../typings/game";
import { View } from "../base/view";
import { globally } from "../util/decorator";
import { singleton } from "../util/singleton";

/** ui管理 */
export class UIMgr {
  /** 所有已经打开的界面 */
  static uiMap: View[] = [];

  /** 打开一个界面 */
  async open<
    T extends RealGameModuleType<GameModuleType>,
    U extends PickAndFlatten<T, keyof T>,
    K extends ViewList<U>,
    X extends { onInit(...args): void }
  >(viewName: K, ...arg: Param<Cls<U[K], X>>) {
    console.log("打开一个界面");
    let viewComp = await getViewInfo(viewName as string);
    let viewInfo = viewComp.viewInfo;
    let path = viewInfo.path;
  }

  /** 关闭一个界面 */
  close() {}
}

const ui = singleton(UIMgr);
export default ui;
globally("ui", ui);
