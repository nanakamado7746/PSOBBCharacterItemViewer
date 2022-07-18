class Character extends Abstract {

  // キャラクターのスロット番号
  Slot;
  // キャラクターの名前
  Name;
  // キャラクターのギルドカード番号
  GuildCardNumber;
  // キャラクターのクラス
  Class;
  // キャラクターのセクションID
  SectionID;
  // キャラクターのレベル
  Level;
  // キャラクターの経験値
  Experience;
  // キャラクターのEp1チャレンジの進行度
  Ep1Progress;
  // キャラクターのEp2チャレンジの進行度
  Ep2Progress;
  // キャラクターの所持品
  Inventory = {};
  // キャラクターの倉庫品
  Bank = {};

  constructor(characterData, slot) {
      super(characterData, slot);
      // キャラクターのスロット番号をセット
      this.setSlot(slot);
      // キャラクターの名前をセット
      this.setName(characterData);
      // キャラクターの種族をセット
      this.setGuildCardNumber(characterData);
      // キャラクターの種族をセット
      this.setClass(characterData);
      // キャラクターのセクションIDをセット
      this.setSectionID(characterData);
      // キャラクターのレベルをセット
      this.setLevel(characterData);
      // キャラクターの経験値をセット
      this.setExperience(characterData);
      // キャラクターのEp1チャレンジの進行度
      this.setEp1Progress(characterData, 11460, 9);
      // キャラクターのEp2チャレンジの進行度
      this.setEp2Progress(characterData, 11496, 6);
      // キャラクターの所持品をセット
      this.setInventory(characterData.slice(20, 860), this.Inventory, 28, slot, "EN");
      // キャラクター倉庫アイテムをセット
      this.setInventory(characterData.slice(1800, 6600), this.Bank, 24, `${slot} Bank`, "EN");
      // キャラクターの所持品をセット
      this.setInventory(characterData.slice(20, 860), this.Inventory, 28, slot, "JA");
      // キャラクター倉庫アイテムをセット
      this.setInventory(characterData.slice(1800, 6600), this.Bank, 24, `${slot} Bank`, "JA");
      // キャラクターの所持メセタをインベントリに追加
      this.setMeseta(characterData.slice(884,887), this.Inventory, slot, "EN");
      // キャラクターの所持メセタをインベントリに追加
      this.setMeseta(characterData.slice(1795,1799), this.Bank, `${slot} Bank`, "EN");
      // キャラクターの倉庫メセタを倉庫に追加
      this.setMeseta(characterData.slice(884,887), this.Inventory, slot, "JA");
      // キャラクターの倉庫メセタを倉庫に追加
      this.setMeseta(characterData.slice(1795,1799), this.Bank, `${slot} Bank`, "JA");
  }

  setName(characterData)
  {
    const array = characterData.slice(968,988);
    let name = "";
    for (let i = 0; i < array.length; i += 2)
    {
      // ２バイトとも0値だったら終わり
      if (array[i] + array[i + 1] === 0) break;
      name += String.fromCharCode((array[i + 1] << 8) | array[i]);
    }

    console.log(`name: ${CommonUtil.binaryArrayToHex(array)}`);
    console.log(`name: ${name}`);
    this.Name = name;
  }

  setGuildCardNumber(characterData)
  {
    const array = characterData.slice(888,896);
    let guildCardNumber = "";
    for (const value of array)
    {
      guildCardNumber += value & 0x0F;
    }

    console.log(`guildCardNumber: ${CommonUtil.binaryArrayToHex(array)}`);
    console.log(`guildCardNumber: ${guildCardNumber}`);
    this.GuildCardNumber = guildCardNumber;
  }

  setClass(characterData)
  {
    (characterData[937] in Config.Classes)
      ? this.Class = Config.Classes[characterData[937]]
      : this.Class = "undefined";
      console.log(`class: ${characterData[937]}`);
  }

  setSectionID(characterData)
  {
    (characterData[936] in Config.SectionIDs)
      ? this.SectionID = Config.SectionIDs[characterData[936]]
      : this.SectionID = "undefined";
      console.log(`sectionID: ${characterData[936]}`);
  }

  setLevel(characterData)
  {
    console.log(`level: ${characterData[876] + 1}`);
    this.Level = characterData[876] + 1;
  }

  setExperience(characterData) {}

  setEp1Progress(characterData, index, number)
  {
    const count = this.progressCount(characterData, index, number);
    (count === 0)
      ? this.Ep1Progress = "No Progress"
      : this.Ep1Progress = `Stage ${count} Cleared! | ${Config.Titles[count]}`;
  }

  setEp2Progress(characterData, index, number)
  {
    const count = this.progressCount(characterData, index, number);
    (count === 0)
      ? this.Ep2Progress = "No Progress"
      : this.Ep2Progress = `Stage ${count} Cleared!`;
  }

  progressCount(characterData, index, max)
  {
    let count = 0;
    for (let i = 0; i < max; i++)
    {
      // 4バイトの合計が０の場合は終了（そのステージのクリア実績なし）
      if (characterData.slice(index, index + 4).join('') == 0) break;
      count += 1;
      index += 4;
    }
    return count;
  }
}
