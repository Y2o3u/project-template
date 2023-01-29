import { Data } from "../common/base/data";
import { globally } from "../common/util/decorator";
import { CommonModule, GameModule } from "./index";
import viewMapJson from "../../src/config/view-map.json";

export { GameModule, CommonModule };

export type PromiseModule<T> = T extends () => Promise<infer V> ? V : never;

/** 通用模块类型 */
export type CommonModuleType = typeof CommonModule;

/** 游戏功能模块类型 */
export type GameModuleType = typeof GameModule;

export type DataModule = PromiseModule<CommonModuleType["Data"]>;

type DataInstanceType<T> = T extends { new (...args): infer R; getInst() }
  ? R
  : never;

type FormatDataKey<T> = T extends `${infer Name}Data` ? Name : T;

type ModuleValue<T> = T extends () => infer V ? V : never;

/** data中导出Data的键值对类型 */
type DataType = {
  [K in keyof DataModule as DataModule[K] extends { new (): Data }
    ? FormatDataKey<K>
    : never]: DataInstanceType<DataModule[K]>;
};

/** Data相关类的键值对对象 */
let dataClassMap = {};
export function setDataClassMap(instMap) {
  dataClassMap = instMap;
}

/** 获取通用模块包含的类 */
export function getCommonModule<K extends keyof CommonModuleType>(
  key: K
): ModuleValue<CommonModuleType[K]> {
  return CommonModule[key]() as any;
}

/** 获取游戏功能模块 */
export function getGameModule<K extends keyof GameModuleType>(
  key: K
): ModuleValue<GameModuleType[K]> {
  return GameModule[key]() as any;
}

/** 获取一个模块中包含的界面 */
export function getViewInfo(view: string) {
  const module = viewMapJson[view];
  const r = getGameModule(module) as Promise<any>;
  return r.then((mobj) => mobj[view]);
}

/** 通过代理方式获取数据类实例 */
export const GData: DataType = new Proxy({} as any, {
  get(obj, name: string) {
    return dataClassMap[`${name}Data`].getInst();
  },
});

/** 绑定到全局中,方便浏览器中预览 */
globally("GData", GData);
