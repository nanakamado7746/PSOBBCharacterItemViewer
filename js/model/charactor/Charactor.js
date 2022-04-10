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
  // キャラクターのEp1チャレンジの進行度
  Ep1Progress;
  // キャラクターのEp2チャレンジの進行度
  Ep2Progress;
  // キャラクターの所持品
  Inventory = {};
  // キャラクターの倉庫品
  Bank = {};

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
      // キャラクターのEp1チャレンジの進行度
      this.setEp1Progress(charactorData, 11460, 9);
      // キャラクターのEp2チャレンジの進行度
      this.setEp2Progress(charactorData, 11496, 6);
      // キャラクターの所持品をセット
      this.setInventory(charactorData.slice(20, 860), this.Inventory, 30, 28, slot, "EN");
      // キャラクター倉庫アイテムをセット
      this.setInventory(charactorData.slice(1800, 6600), this.Bank, 200, 24, `${slot} Bank`, "EN");
      // キャラクターの所持品をセット
      this.setInventory(charactorData.slice(20, 860), this.Inventory, 30, 28, slot, "JA");
      // キャラクター倉庫アイテムをセット
      this.setInventory(charactorData.slice(1800, 6600), this.Bank, 200, 24, `${slot} Bank`, "JA");
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
    (charactorData[937] in this.Config.Classes)
      ? this.Class = this.Config.Classes[charactorData[937]]
      : this.Class = "undefined";
      console.log(`class: ${charactorData[937]}`);
  }

  setSectionID(charactorData)
  {
    (charactorData[936] in this.Config.SectionIDs)
      ? this.SectionID = this.Config.SectionIDs[charactorData[936]]
      : this.SectionID = "undefined";
      console.log(`sectionID: ${charactorData[936]}`);
  }

  setLevel(charactorData)
  {
    console.log(`level: ${charactorData[876] + 1}`);
    this.Level = charactorData[876] + 1;
  }

  setEp1Progress(charactorData, index, number)
  {
    console.log("challenge progress: ep1")
    const count = this.clearCount(charactorData, index, number);
    (count === 0)
      ? this.Ep1Progress = "No Progress"
      : this.Ep1Progress = `Stage ${count} Cleared! | ${this.Config.Titles[count]}`;
  }

  setEp2Progress(charactorData, index, number)
  {
    console.log("challenge progress: ep2")
    const count = this.clearCount(charactorData, index, number);
    (count === 0)
      ? this.Ep2Progress = "No Progress"
      : this.Ep2Progress = `Stage ${count} Cleared!`;
  }

  setExperience(charactorData) {}

  clearCount(charactorData, index, number)
  {
    let count = 0;
    for (let i = 0; i < number; i++)
    {
      if (charactorData.slice(index, index + 4).join('') != 0)
      {
        console.log("stage:" + i + 1);
        console.log("clear time:");
        console.log(charactorData.slice(index, index + 4));
        count += 1;
      }
      index = index + 4;
    }
    return count;
  }
}
