class Charactor extends Abstract {

  // キャラクターのスロット番号
  Slot;
  // キャラクターの名前
  Name;
  // キャラクターのクラス
  Class;
  // キャラクターのセクションID
  SectionID;
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

  constructor(charactorData, slot) {
      super(charactorData, slot);
      // キャラクターのスロット番号をセット
      this.setSlot(slot);
      // キャラクターの名前をセット
      this.setName(charactorData);
      // キャラクターの種族をセット
      this.setClass(charactorData);
      // キャラクターのレベルをセット
      this.setSectionID(charactorData);
      // キャラクターの経験値をセット
      this.setLevel(charactorData);
      // キャラクターの経験値をセット
      this.setExperience(charactorData);
      // キャラクターの所持品をセット
      this.setInventory(charactorData.slice(20, 860), this.Inventory, 30, 28, slot);
      // キャラクター倉庫アイテムをセット
      this.setInventory(charactorData.slice(1800, 6600), this.Bank, 200, 24, slot);
  }

  setSlot(slot)
  {
    this.Slot = slot;
  }

  setName(charactorData)
  {
    let array = charactorData.slice(968,988);
    let name = "";
    for (let i = 0; i < array.length; i += 2)
    {
      // ２バイトとも0値だったら終わり
      if (array[i] + array[i + 1] === 0) break;
      name += String.fromCharCode((array[i + 1] << 8) | array[i]);
    }
    console.log(`name: ${name}`);
    this.Name = name;
  }

  setClass(charactorData)
  {
    (charactorData[937] in this.config.Classes)
      ? this.Class = this.config.Classes[charactorData[937]]
      : this.Class = "undefined";
      console.log(`class: ${charactorData[937]}`);
  }

  setSectionID(charactorData)
  {
    (charactorData[936] in this.config.SectionIDs)
      ? this.SectionID = this.config.SectionIDs[charactorData[936]]
      : this.SectionID = "undefined";
      console.log(`sectionID: ${charactorData[936]}`);
  }

  setLevel(charactorData)
  {
    console.log(`level: ${charactorData[876] + 1}`);
    this.Level = charactorData[876] + 1;
  }

  setExperience(charactorData) {}
}
