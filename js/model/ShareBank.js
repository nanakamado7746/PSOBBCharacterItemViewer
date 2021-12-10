class ShareBank extends Abstract {

  // キャラクターのメセタ
  Meseta;
  // 共有倉庫品
  ShareBank = [];

  constructor(charactorBuffer, slot, newItemCodes)
  {
    super(charactorBuffer, slot, newItemCodes);
    this.setMeseta();
    this.setInventory(charactorBuffer.slice(8, 4808), this.ShareBank, 200, 24, slot);
  }

  setMeseta(charactorBuffer) {}

}
