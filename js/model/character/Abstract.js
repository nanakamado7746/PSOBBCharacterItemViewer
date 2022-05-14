class Abstract {

  constructor(characterData, slot)
  {
    Config.init();
    console.log(characterData);
  }

  setInventory(itemsData, inventory, length, slot, lang)
  {
    console.log(itemsData);

    let array = [];
    let index = 0;
    let end = length;
    // 全アイテムエリアをアイテム単位でループする。
    for (let i = 0;i < itemsData.length; i += length)
    {
        console.log(`============ item data start ============`);
        console.log(`item number:${i / length}, index:${i}, length:${length}, end:${i + length}`);
        console.log("slot:" + slot);

        console.log("itemData:");
        let itemData = itemsData.slice(i, i + length);
        console.log(itemData);

        // 空欄チェック
        if (this.isBlank(itemData)) continue;

        // アイテムコード取得
        let itemCode = this.binaryArrayToInt(itemData.slice(0, 3));
        let itemCodeHex = this.binaryArrayToHex(itemData.slice(0, 3));
        console.log("item code:" + itemCodeHex);

        let item = new Item(itemData, itemCode, lang).Item;

        // 所持品のリストにアイテム情報を追加
        array.push([
          itemCodeHex,
          item,
          slot
        ]);
    }
      inventory[lang] = array;
  }

  setMeseta(mesetaData, inventory, slot, lang)
  {
    const name = (lang === "EN") ? "MESETA" : "メセタ";
    const meseta = (mesetaData[2] << 8 | mesetaData[1]) << 8 | mesetaData[0];
    const item = {
      type: 10,
      name: name,
      value: meseta,
      display: `${meseta} ${name} `,
    };
    inventory[lang].push([
      "09" + meseta.toString().padStart(7, '0'), // prefixをつけてメセタをアイテムコードの最大値にする。
      item,
      slot
    ]);
  }

  isBlank(itemData)
  {
    return (itemData.slice(0, 20).join('') == 0 || this.binaryArrayToHex(itemData) == "000000000000000000000000FFFFFFFF0000000000000000");
  }

  binaryArrayToInt(arr){
    let int;
    for (let el of arr)
    {
      int = int << 8 | el;
    }
    return int;
  }

  binaryArrayToHex(arr){

    let str = '';
    for(let el of arr)
    {
        str += el.toString('16').padStart(2, '0')
    }
    return str.toUpperCase();
  }

}
