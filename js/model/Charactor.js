class Charactor extends Abstract {

  // キャラクターの名前
  Name;
  // キャラクターの種族
  Slot;
  // キャラクターの種族
  Race;
  // キャラクターのレベル
  Level;
  // キャラクターの経験値
  Experience;
  // キャラクターのメセタ
  Meseta;
  // キャラクターの所持品
  Inventory = [];
  // キャラクターの倉庫品
  Bank = [];

  constructor(charactorBuffer, slot, newItemCodes) {
      super(charactorBuffer, slot, newItemCodes);
      // キャラクターの名前をセット
      this.setName(charactorBuffer);
      // キャラクターのスロットをセット
      this.setSlot(slot);
      // キャラクターの種族をセット
      this.setRace(charactorBuffer);
      // キャラクターのレベルをセット
      this.setLevel(charactorBuffer);
      // キャラクターの経験値をセット
      this.setExperience(charactorBuffer);
      // キャラクターの所持品をセット
      this.setInventory(charactorBuffer.slice(20, 860), this.Inventory, 30, 28, slot);
      // キャラクター倉庫アイテムをセット
      this.setInventory(charactorBuffer.slice(1800, 6600), this.Bank, 200, 24, slot);
  }

  setName(charactorBuffer) {}
  setSlot(slot)
  {
    this.Slot = slot;
  }
  setRace(charactorBuffer) {}
  setLevel(charactorBuffer) {}
  setExperience(charactorBuffer) {}
}
