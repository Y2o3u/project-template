import * as Data from "../data";
import * as Pet from "../game/pet";

/** 通用模块 */
export const CommonModule = {
  Data: () => Promise.resolve(Data),
};

/** 游戏模块 */
export const GameModule = {
  Pet: () => Promise.resolve(Pet),
};
