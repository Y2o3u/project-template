import { DEV, EDITOR } from "cc/env";

/**
 * 将类绑定到全局，方便浏览器调试，代码生成器会自动生成调用，一般不用于手动调用
 * @param target
 */
export function bind2window(target: Function) {
  if (!EDITOR && typeof tt === "undefined") {
    let className = target.name;
    if (typeof globalThis[className] !== "undefined") {
      console.error(`全局下已存在${className}属性，请使用其他全局名代替!!`);
    } else {
      globalThis[className] = target;
    }
  }
}

/**
 * 将对象绑定到全局环境中
 * @param name
 * @param target
 */
export function globally(name: string, target: any) {
  if (!EDITOR && DEV) {
    if (typeof globalThis[name] !== "undefined") {
      console.error(`全局下已存在${name}属性，请使用其他全局名代替!!`);
    } else {
      globalThis[name] = target;
    }
  }
}
