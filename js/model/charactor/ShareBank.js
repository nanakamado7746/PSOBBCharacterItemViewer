class ShareBank extends Abstract {

  // 共有倉庫品
  ShareBank = {};

  constructor(characterData, slot)
  {
    super(characterData, slot);
    this.setInventory(characterData.slice(8, 4808), this.ShareBank, 24, slot, "EN");
    this.setInventory(characterData.slice(8, 4808), this.ShareBank, 24, slot, "JA");
    // キャラクターの所持メセタをインベントリに追加
    this.setMeseta(characterData.slice(4, 7), this.ShareBank, slot, "EN");
    // キャラクターの倉庫メセタを倉庫に追加
    this.setMeseta(characterData.slice(4, 7), this.ShareBank, slot, "JA");
  }

}
