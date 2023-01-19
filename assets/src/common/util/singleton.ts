import { object } from "./object";

// 单例存储，方便统一释放
let singletonMap = {};

/** 返回一个单例 */
export function singleton<T>(
  type: { new (): T },
  instanceCb?: (inst: T) => void
): T {
  let typeId = object.getUniqueId(type);
  let inst: T = singletonMap[typeId];
  if (!inst) {
    inst = new type();
    singletonMap[typeId] = inst;
    instanceCb && instanceCb(inst);
  }
  return inst;
}
