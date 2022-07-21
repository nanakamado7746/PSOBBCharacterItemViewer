class Abstract {

  constructor(characterData, slot)
  {
    Config.init();
    console.log("====== characterData ======");
    console.log(characterData);
  }

  setInventory(itemsData, inventory, length, slot, lang)
  {
    console.log("====== itemsData ======");
    console.log(itemsData);

    let array = [];
    // 全アイテムエリアをアイテム単位でループする。
    for (let i = 0;i < itemsData.length; i += length)
    {
        console.log(`============ item data start ============`);
        console.log(`item number:${i / length}, index:${i}, length:${length}, end:${i + length}`);
        console.log("slot:" + slot);

        const itemData = itemsData.slice(i, i + length);
        console.log("itemData:");
        // 空欄チェック
        if (this.isBlank(itemData)) continue;
        console.log(itemData);

        // アイテムコード取得
        const itemCode = CommonUtil.binaryArrayToInt(itemData.slice(0, 3));
        const itemCodeHex = CommonUtil.binaryArrayToHex(itemData.slice(0, 3));
        console.log("item code:" + itemCodeHex);

        const item = new Item(itemData, itemCode, lang).Item;
        console.log("item name:" + item["display"]);

        // 所持品のリストにアイテム情報を追加
        array.push([
          itemCodeHex,
          item,
          slot
        ]);
    }
      inventory[lang] = array;
  }

  setSlot(slot)
  {
    this.Slot = slot;
  }

  setMeseta(mesetaData, inventory, slot, lang)
  {
    const name = (lang === "EN") ? "MESETA" : "メセタ";
    const meseta = (mesetaData[2] << 8 | mesetaData[1]) << 8 | mesetaData[0];
    const item = {
      type: 10,
      name: name,
      value: meseta,
      display: `${meseta} ${name}`,
    };
    inventory[lang].push([
      "09" + meseta.toString().padStart(7, '0'), // prefixをつけてメセタをアイテムコードの最大値にする。
      item,
      slot
    ]);
  }

  isBlank(itemData)
  {
    return (itemData.slice(0, 20).join('') == 0 || CommonUtil.binaryArrayToHex(itemData) == "000000000000000000000000FFFFFFFF0000000000000000");
  }
}
