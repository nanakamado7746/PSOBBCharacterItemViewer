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

  constructor(binaryCharactor, slot, newItemCodes) {
      super(binaryCharactor, slot, newItemCodes);
      // キャラクターの名前をセット
      this.setName(binaryCharactor);
      // キャラクターのスロットをセット
      this.setSlot(slot);
      // キャラクターの種族をセット
      this.setRace(binaryCharactor);
      // キャラクターのレベルをセット
      this.setLevel(binaryCharactor);
      // キャラクターの経験値をセット
      this.setExperience(binaryCharactor);
      // キャラクターの所持品をセット
      this.setInventory(binaryCharactor.slice(20, 860), this.Inventory, 30, 28, slot);
      // キャラクター倉庫アイテムをセット
      this.setInventory(binaryCharactor.slice(1800, 6600), this.Bank, 200, 24, slot);
  }

  setName(binaryCharactor)
  {
    let array = binaryCharactor.slice(968,988);
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
  setRace(binaryCharactor) {}
  setLevel(binaryCharactor) {}
  setExperience(binaryCharactor) {}
}
