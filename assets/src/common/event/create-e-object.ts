import EventEmitter from "eventemitter3";

export function createEObject<T>() {
  const eobj = new EObject();
  return new Proxy(
    {},
    {
      get(obj, name: string) {
        return eobj.getObject(name);
      },
    }
  ) as ConvertEventObject<T>;
}

class EObject {
  private _map = {};

  getObject(name: string) {
    if (!this._map[name]) {
      this._map[name] = new EObjectItem();
    }
    return this._map[name].proxy;
  }
}

class EObjectItem {
  private _emitter = new EventEmitter();

  private _prop = {};

  private _proxy = null;
  get proxy() {
    if (this._proxy == null) {
      this._proxy = new Proxy(
        {},
        {
          get: (target, prop: string) => {
            if (!this._prop[prop]) {
              this._prop[prop] = new EObjectPropItem(prop, this._emitter);
            }
            return this._prop[prop];
          },
        }
      );
    }
    return this._proxy;
  }
}

class EObjectPropItem {
  constructor(private _name: string, private emitter: EventEmitter) {}

  get event() {
    return this._name;
  }

  _kind = "e";

  on(name: string, func: () => void, context?: any) {
    this.emitter.on(name, func, context);
  }

  off(name: string, func: () => void, context?: any) {
    this.emitter.off(name, func, context);
  }

  emit(name: string, ...args) {
    this.emitter.emit(name, ...args);
  }
}
