import EventEmitter from "eventemitter3";
import { globally } from "../util/decorator";
import { createEObject } from "./create-e-object";

/** 事件管理 */
export class EventMgr {}
export const emitter = new EventEmitter();

globally("E", createEObject());
