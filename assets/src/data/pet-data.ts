import { Data } from "../common/base/data";
import { observable } from "../common/util/mobx";

/** 宠物数据 */
export interface IPetData {
  /** 等级 */
  lv: number;
  /** 昵称 */
  name: string;
}

/** 玩家数据 */
export class PetData extends Data {
  cache: IPetData = observable({
    lv: 1,
    name: "",
  });
}
