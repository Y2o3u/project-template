const uniqueKey = `$uniqueKey_id$`;
/** 唯一id */
let uniqueId = 0;

export module object {
  /** 获取一个唯一id */
  export function getUniqueId<T>(type: T) {
    let id = type[uniqueKey];
    if (type && !id) {
      uniqueId++;
      type[uniqueKey] = uniqueId;
    }
    return type[uniqueKey];
  }
}
