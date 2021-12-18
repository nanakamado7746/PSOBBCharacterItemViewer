class Abstract {
  config = new Config();

  constructor(charactorData, slot, newItemCodes)
  {
    // addonのファイルリストを取得している場合、アイテムコードを更新する。
    if (typeof newItemCodes !== "undefined")
    {
      this.config.ItemCodes = newItemCodes;
    }
    console.log(charactorData);
  }

  setInventory(itemsData, inventory, max, length, slot)
  {
    console.log(itemsData);

    let index = 0;
    let end = length;
    // 全アイテムエリアをアイテム単位でループする。
    for (let i = 0;i < max; i++)
    {
        let itemData = itemsData.slice(index, end);
        console.log(itemData);
        console.log("item itemData length:" + itemData.length);
        console.log(`item number:${i}, index:${index}, length:${length}, end:${end}`);
        // 空欄チェック
        if (this.isBlank(itemData)) continue;
        // アイテムコード取得
        let itemCode = this.binArrayToString(itemData.slice(0, 3));
        console.log("item code:" + itemCode);
        // アイテムの種類を取得（武器、鎧、テクニックなど）
        let itemType = this.getItemType(itemCode);
        console.log("item type:" + itemType);
        let item = this.getItem(itemData, itemCode, itemType);
        console.log(item);
        // アイテム情報を取得
        let arry = [
          itemCode,
          item,
          slot
        ];
        // 所持品のリストにアイテム情報を追加
        inventory.push(arry);

        // アイテム情報の開始位置を次のアイテムに更新
        index += length;
        end += length;
      }
  }

  getItem(itemData, itemCode, itemType)
  {
    switch(itemType) {
      case (this.config.ItemType.SRANK_WEAPON):
        return this.sRankWeapon(itemCode, itemData);
      case (this.config.ItemType.WEAPON):
        return this.weapon(itemCode, itemData);
      case (this.config.ItemType.FRAME):
        return this.frame(itemCode, itemData);
      case (this.config.ItemType.BARRIER):
        return this.barrier(itemCode, itemData);
      case (this.config.ItemType.UNIT):
        return this.unit(itemCode, itemData);
      case (this.config.ItemType.MAG):
        return this.mag(itemCode, itemData);
      case (this.config.ItemType.DISK):
        return this.disk(itemCode, itemData);
      case (this.config.ItemType.TOOL):
        return this.tool(itemCode, itemData);
      case (this.config.ItemType.REINFORCEMENT):
        return this.reinforcement(itemCode, itemData);
      case (this.config.ItemType.OTHER):
        return this.other(itemCode, itemData);
      default:
        return `unknown. (${itemCode}). There's a possibility that New Ephinea Item`;
    }
  }

  getItemType(itemCode)
  {
    if (this.isSRankWeapon(itemCode)) return this.config.ItemType.SRANK_WEAPON;
    if (this.isWeapon(itemCode)) return this.config.ItemType.WEAPON;
    if (this.isFrame(itemCode)) return this.config.ItemType.FRAME;
    if (this.isBarrier(itemCode)) return this.config.ItemType.BARRIER;
    if (this.isUnit(itemCode)) return this.config.ItemType.UNIT;
    if (this.isMag(itemCode)) return this.config.ItemType.MAG;
    if (this.isDisk(itemCode)) return this.config.ItemType.DISK;
    if (this.isTool(itemCode)) return this.config.ItemType.TOOL;
    if (this.isReinforcement(itemCode)) return this.config.ItemType.REINFORCEMENT;
    return this.config.ItemType.OTHER;
  }

  isBlank(itemData)
  {
    return (itemData.slice(0, 20).join('') == 0 || this.binArrayToString(itemData) == "000000000000000000000000FFFFFFFF0000000000000000");
  }
  isSRankWeapon(itemCode)
  {
    return (this.config.SRankWeaponRange[0] <= parseInt(itemCode.substring(0, 4), 16) && parseInt(itemCode.substring(0, 4), 16) <= this.config.SRankWeaponRange[1]);
  }
  isWeapon(itemCode)
  {
    return (this.config.WeaponRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.config.WeaponRange[1]);
  }
  isCommonWeapon(itemCode)
  {
    // コモン武器が含まれている最小アイテムコード以下、かつコモン武器のグレード数以下であること
    return (parseInt(itemCode, 16) <= this.config.CommonWeaponContainsCode && parseInt(itemCode.substring(4, 6), 16) <= this.config.CommonWeaponsMaxCode);
  }
  isFrame(itemCode)
  {
    return (this.config.FrameRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.config.FrameRange[1]);
  }
  isBarrier(itemCode)
  {
    return (this.config.BarrierRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.config.BarrierRange[1]);
  }
  isUnit(itemCode)
  {
    return (this.config.UnitRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.config.UnitRange[1]);
  }
  isMag(itemCode)
  {
    return (this.config.MagRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.config.MagRange[1]);
  }
  isDisk(itemCode)
  {
    return (parseInt(itemCode.substring(0, 4), 16) == this.config.DiskCode);
  }
  isTool(itemCode)
  {
    return (this.config.ToolRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.config.ToolRange[1]);
  }
  isReinforcement(itemCode)
  {
    return (this.config.ReinforcementRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.config.ReinforcementRange[1]);
  }

  weapon(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    let grinder = itemData[3];
    let native = this.getNative(itemData);
    let aBeast = this.getABeast(itemData);
    let machine = this.getMachine(itemData);
    let dark = this.getDark(itemData);
    let hit = this.getHit(itemData);

    // コモン武器の場合はエレメントの設定をする。
    let element = "";
    if (this.isCommonWeapon(itemCode)) element = ` [${this.getElement(itemData)}]`;

    return `${name}${this.grinderLabel(grinder)}${element} [${native}/${aBeast}/${machine}/${dark}|${hit}]`;
  }

  frame(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    let slot = itemData[5];
    let def = itemData[6];
    let defMaxAddition = this.getAddition(name, this.config.FrameAdditions, this.config.AdditionType.DEF);
    let avoid = itemData[8];
    let avoidMaxAddition = this.getAddition(name, this.config.FrameAdditions, this.config.AdditionType.AVOID);
    return `${name} [${def}/${defMaxAddition}|${avoid}/${avoidMaxAddition}] [${slot}S]`;
  }

  barrier(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    let def = itemData[6];
    let defMaxAddition = this.getAddition(name, this.config.BarrierAdditions, this.config.AdditionType.DEF);
    let avoid = itemData[8];
    let avoidMaxAddition = this.getAddition(name, this.config.BarrierAdditions, this.config.AdditionType.DEF);
    return `${name} [${def}/${defMaxAddition}|${avoid}/${avoidMaxAddition}]`;
  }

  unit(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    return name;
  }

  mag(itemCode, itemData)
  {
    let name = this.getItemName(itemCode.substring(0, 4) + "00");
    let level = itemData[2];
    let sync = itemData[16];
    let iq = itemData[17];
    let collor = this.config.MagCollorCodes[itemData[19]];
    let def = this.binArrayToInt([itemData[5], itemData[4]]) / 100;
    let pow = this.binArrayToInt([itemData[7], itemData[6]]) / 100;
    let dex = this.binArrayToInt([itemData[9], itemData[8]]) / 100;
    let mind = this.binArrayToInt([itemData[11], itemData[10]]) / 100;
    // pbsの要素は0=center, 1=right、2=left
    let pbs = this.getPbs(this.binArrayToString([itemData[3], itemData[18]]));

    return `${name} LV${level} [${collor}] [${def}/${pow}/${dex}/${mind}] [${pbs[2]}|${pbs[0]}|${pbs[1]}]`;
  }

  disk(itemCode, itemData)
  {
    let name = this.config.DiskNameCodes[itemData[4]];
    let level = itemData[2] + 1;
    return `${name} LV${level} disk`;
  }

  sRankWeapon(itemCode, itemData)
  {
    let name = this.config.SRankWeaponCodes[parseInt(itemCode.substring(0, 4) + "00", 16)];
    let grinder = itemData[3];
    let element = this.getSrankElement(itemData);

    return `S-RANK ${name}${this.grinderLabel(grinder)} [${element}]`;
  }

  tool(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    let number = 0;
    (itemData.length === 28)
      // イベントリの場合
      ? number = itemData[5]
      // 倉庫の場合
      : number = itemData[20];

    return `${name}${this.numberLabel(number)}`;
  }

  reinforcement(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    (itemData.length === 28)
      // イベントリの場合
      ? number = itemData[5]
      // 倉庫の場合
      : number = itemData[20];

    return `${name}${this.numberLabel(number)}`;
  }

  other(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    let number = 0;
    (itemData.length === 28)
      // イベントリの場合
      ? number = itemData[5]
      // 倉庫の場合
      : number = itemData[20];

    return `${name}${this.numberLabel(number)}`;
  }

  getItemName(itemCode)
  {
    itemCode = "0x" + itemCode;

    if (itemCode in this.config.ItemCodes)
    {
      return this.config.ItemCodes[itemCode];
    }
    return `undefined. (${itemCode})`;
  }

  getElement(itemData)
  {
      let elementCode = itemData[4];
      if (elementCode in this.config.ElementCodes)
      {
          return this.config.ElementCodes[elementCode];
      }

      return "undefined";
  }

  getSrankElement(itemData)
  {
      let elementCode = itemData[2];
      if (elementCode in this.config.SrankElementCodes)
      {
          return this.config.SrankElementCodes[elementCode];
      }

      return "undefined";
  }

  getNative(itemData)
  {
    return this.getAttribute(this.config.AttributeType["native"], itemData);
  }
  getABeast(itemData)
  {
    return this.getAttribute(this.config.AttributeType["aBeast"], itemData);
  }
  getMachine(itemData)
  {
    return this.getAttribute(this.config.AttributeType["machine"], itemData);
  }
  getDark(itemData)
  {
    return this.getAttribute(this.config.AttributeType["dark"], itemData);
  }
  getHit(itemData)
  {
    return this.getAttribute(this.config.AttributeType["hit"], itemData);
  }

  getAttribute(attributeType, itemData)
  {
    let attributes =
    [
        // ひとつめの属性値
        itemData.slice(6, 8),
        // ふたつめの属性値
        itemData.slice(8, 10),
        // みっつめの属性値
        itemData.slice(10, 12),
    ];
    for (let i in attributes)
    {
        if (attributes[i][0] == attributeType)
        {
            return attributes[i][1];
        }
    }
    return 0;
  }

  getAddition(name, additions, type)
  {
    if (name in additions)
    {
      return additions[name][type];
    }
    return "undefined";
  }

  getPbs(pbsCode)
  {
    if (pbsCode in this.config.PBs)
    {
        return this.config.PBs[pbsCode];
    }
    return ["undefined", "undefined", "undefined"];
  }
  numberLabel(number)
  {
    if (number == 1) return "";
    if (number > 0) return ` x${number}`;
    return "";
  }

  grinderLabel(number)
  {
    if (number > 0) return ` +${number}`;
    return "";
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
