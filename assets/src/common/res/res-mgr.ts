import { Asset, assetManager, loader } from "cc";

/**
 * 资源管理
 */
class ResMgr {
  /** 加载资源 */
  load<T extends typeof Asset>(url: string, res: T) {
    let { bundleName, path, name } = this.parsePath(url);
  }

  /** 加载资源包 */
  loadBundle(bundleName: string) {
    let bundle = assetManager.getBundle(bundleName);
  }

  /**
   * 路径解析
   * @param url
   */
  parsePath(url: string): { bundleName; path; name } {
    const arr = url.split("/");
    let bundleName = "";
    let path = "";
    let name = "";
    if (arr.length > 1) {
      bundleName = arr[0];
      path = url.slice(bundleName.length + 1);
      name = arr[arr.length - 1];
    } else {
      bundleName = url;
      path = "";
    }
    return { bundleName, path, name };
  }

  /** 同步方式加载资源 */
  async loadAsync() {}
}
