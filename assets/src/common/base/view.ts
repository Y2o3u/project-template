import { BaseComponent } from "./base-component";

/** 界面基类 */
export class View extends BaseComponent {
  /** 预加载 */
  async prepare() {
    return null;
  }

  onLoad() {}
}
