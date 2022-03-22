class Abstract {
  Config = new Config();

  constructor(charactorData, slot)
  {
    console.log(charactorData);
  }

  setInventory(itemsData, inventory, max, length, slot, lang)
  {
    console.log(itemsData);

    let array = [];
    let index = 0;
    let end = length;
    // 全アイテムエリアをアイテム単位でループする。
    for (let i = 0;i < max; i++)
    {
        console.log(`============ item data start ============`);
        console.log(`item number:${i}, index:${index}, length:${length}, end:${end}`);
        console.log("slot:" + slot);

        console.log("itemData:");
        let itemData = itemsData.slice(index, end);
        console.log(itemData);
        console.log("itemData length:" + itemData.length);

        // 空欄チェック
        if (this.isBlank(itemData)) continue;

        // アイテムコード取得
        let itemCode = this.binArrayToString(itemData.slice(0, 3));
        console.log("item code:" + itemCode);

        let item = new Item(itemData, itemCode, lang).Item;
        console.log("item name:" + item);

        // 所持品のリストにアイテム情報を追加
        array.push([
          itemCode,
          item,
          slot
        ]);

        // アイテム情報の開始位置を次のアイテムに更新
        index += length;
        end += length;
      }

      inventory[lang] = array;
  }

  isBlank(itemData)
  {
    return (itemData.slice(0, 20).join('') == 0 || this.binArrayToString(itemData) == "000000000000000000000000FFFFFFFF0000000000000000");
  }

  binArrayToInt(arr){
    let str = '';
    for(let el of arr)
    {
      str += el.toString('16').padStart(2, '0')
    }
    return parseInt(str, 16);
  }

  binArrayToString(arr){
    let str = '';
    for(let el of arr)
    {
        str += el.toString('16').padStart(2, '0')
    }
    return str.toUpperCase();
  }

}
