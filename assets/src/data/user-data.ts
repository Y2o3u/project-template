import { Data } from "../common/base/data";
import { mobx } from "../common/util/mobx";

interface IUserData {
  /** 昵称 */
  nickName: string;
  /** 用户id */
  userId: string;
}

/** 玩家数据 */
export class UserData extends Data {
  cache: IUserData = mobx.makeObservable({
    nickName: "yy",
    userId: "111",
  });
}
