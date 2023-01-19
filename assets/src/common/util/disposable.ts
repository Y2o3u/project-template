export interface IDisposable {
  dispose(): void;
}

/** 执行释放 */
export function dispose(disposable: IDisposable): void;
export function dispose(disposable: IDisposable[]): void;
export function dispose(disposable: any) {
  if (disposable instanceof Array) {
    while (disposable.length > 0) {
      const item = disposable.shift();
      item.dispose();
    }
  } else {
    disposable.dispose();
  }
}
