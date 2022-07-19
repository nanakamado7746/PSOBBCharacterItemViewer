class ShareBank extends Abstract {

  // スロット番号
  Slot;
  // モード
  Mode;
  // 共有倉庫品
  Bank = {};

  constructor(characterData, slot)
  {
    super(characterData, slot);
    // キャラクターのスロット番号をセット
    this.setSlot(slot);
    // キャラクターのモードをセット
    this.setMode(slot);
    // キャラクターの所持品をセット
    this.setInventory(characterData.slice(8, 4808), this.Bank, 24, this.Slot, "EN");
    // キャラクターの所持品をセット
    this.setInventory(characterData.slice(8, 4808), this.Bank, 24, this.Slot, "JA");
    // キャラクターの所持メセタをインベントリに追加
    this.setMeseta(characterData.slice(4, 7), this.Bank, this.Slot, "EN");
    // キャラクターの倉庫メセタを倉庫に追加
    this.setMeseta(characterData.slice(4, 7), this.Bank, this.Slot, "JA");
  }

  setSlot(slot)
  {
    (slot == Config.Mode.NORMAL)
      ? this.Slot = "ShareBank"
      : this.Slot = "Classic ShareBank"
  }

  setMode(slot)
  {
    this.Mode = slot;
  }
}
