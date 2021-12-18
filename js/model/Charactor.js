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

  constructor(charactorData, slot, newItemCodes) {
      super(charactorData, slot, newItemCodes);
      // キャラクターの名前をセット
      this.setName(charactorData);
      // キャラクターのスロットをセット
      this.setSlot(slot);
      // キャラクターの種族をセット
      this.setRace(charactorData);
      // キャラクターのレベルをセット
      this.setLevel(charactorData);
      // キャラクターの経験値をセット
      this.setExperience(charactorData);
      // キャラクターの所持品をセット
      this.setInventory(charactorData.slice(20, 860), this.Inventory, 30, 28, slot);
      // キャラクター倉庫アイテムをセット
      this.setInventory(charactorData.slice(1800, 6600), this.Bank, 200, 24, slot);
  }

  setName(charactorData)
  {
    let array = charactorData.slice(968,988);
    let name = "";
    for (let i = 0; i < array.length; i += 2)
    {
      // 0値だったら
      if (array[i] + array[i + 1] === 0) break;
      name += String.fromCharCode((array[i + 1] << 8) | array[i]);
    }
    console.log(name);
    this.Name = name;
  }
  setSlot(slot)
  {
    this.Slot = slot;
  }
  setRace(charactorData) {}
  setLevel(charactorData) {}
  setExperience(charactorData) {}
}
