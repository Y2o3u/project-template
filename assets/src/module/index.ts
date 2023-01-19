import * as Data from "../data";

/** 通用模块 */
export const CommonModule = {
  Data: () => Promise.resolve(Data),
};

/** 游戏模块 */
export const GameModule = {};
