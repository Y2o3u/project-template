declare interface EventObjectType {
  /** 时间 */
  pet: {
    upgradeLv: (lv: number) => void;
    updateName: (name: string) => void;
  };
}
