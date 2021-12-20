class ShareBank extends Abstract {

  // キャラクターのメセタ
  Meseta;
  // 共有倉庫品
  ShareBank = {};

  constructor(binaryCharactor, slot)
  {
    super(binaryCharactor, slot);
    this.setMeseta();
    this.setInventory(binaryCharactor.slice(8, 4808), this.ShareBank, 200, 24, slot, "EN");
    this.setInventory(binaryCharactor.slice(8, 4808), this.ShareBank, 200, 24, slot, "JA");
  }

  setMeseta(binaryCharactor) {}

}
