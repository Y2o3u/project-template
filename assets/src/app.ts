import { Game, game } from "cc";
import { getCommonModule, setDataClassMap } from "./module/get-module";

/** 进入游戏默认执行的内容 */
game.on(Game.EVENT_GAME_INITED, async () => {
  let dataMap = await getCommonModule("Data");
  setDataClassMap(dataMap);
});
