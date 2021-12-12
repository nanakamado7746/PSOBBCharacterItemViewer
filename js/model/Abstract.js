class Abstract {
  config = new Config();

  constructor(charactorBuffer, slot, newItemCodes)
  {
    // addonのファイルリストを取得している場合、アイテムコードを更新する。
    if (typeof newItemCodes !== "undefined")
    {
      this.config.ItemCodes = newItemCodes;
    }
    console.log(charactorBuffer);
  }

  setInventory(itemsBuffer, inventory, max, length, slot)
  {
    console.log(itemsBuffer);

    let index = 0;
    let end = length;
    // 全アイテムエリアをアイテム単位でループする。
    for (let i = 0;i < max; i++)
    {
        let itemBuffer = itemsBuffer.slice(index, end);
        console.log(itemBuffer);
        console.log("item itemBuffer length:" + itemBuffer.length);
        console.log(`item number:${i}, index:${index}, length:${length}, end:${end}`);
        // 空欄チェック
        if (this.isBlank(itemBuffer)) continue;
        // アイテムコード取得
        let itemCode = this.joinArrayToString(itemBuffer.slice(0, 3));
        console.log("item code:" + itemCode);
        // アイテムの種類を取得（武器、鎧、テクニックなど）
        let itemType = this.getItemType(itemCode);
        console.log("item type:" + itemType);
        let item = this.getItem(itemBuffer, itemCode, itemType);
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

  getItem(itemBuffer, itemCode, itemType)
  {
    switch(itemType) {
      case (this.config.ItemType.SRANK_WEAPON):
        return this.sRankWeapon(itemCode, itemBuffer);
      case (this.config.ItemType.WEAPON):
        return this.weapon(itemCode, itemBuffer);
      case (this.config.ItemType.FRAME):
        return this.frame(itemCode, itemBuffer);
      case (this.config.ItemType.BARRIER):
        return this.barrier(itemCode, itemBuffer);
      case (this.config.ItemType.UNIT):
        return this.unit(itemCode, itemBuffer);
      case (this.config.ItemType.MAG):
        return this.mag(itemCode, itemBuffer);
      case (this.config.ItemType.DISK):
        return this.disk(itemCode, itemBuffer);
      case (this.config.ItemType.TOOL):
        return this.tool(itemCode, itemBuffer);
      case (this.config.ItemType.REINFORCEMENT):
        return this.reinforcement(itemCode, itemBuffer);
      case (this.config.ItemType.OTHER):
        return this.other(itemCode, itemBuffer);
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

  isBlank(itemBuffer)
  {
    return (itemBuffer.slice(0, 20).join('') == 0 || this.joinArrayToString(itemBuffer) == "000000000000000000000000FFFFFFFF0000000000000000");
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

  weapon(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode);
    let grinder = itemBuffer[3];
    let native = this.getNative(itemBuffer);
    let aBeast = this.getABeast(itemBuffer);
    let machine = this.getMachine(itemBuffer);
    let dark = this.getDark(itemBuffer);
    let hit = this.getHit(itemBuffer);

    // コモン武器の場合はエレメントの設定をする。
    let element = "";
    if (this.isCommonWeapon(itemCode)) element = ` [${this.getElement(itemBuffer)}]`;

    return `${name}${this.grinderLabel(grinder)}${element} [${native}/${aBeast}/${machine}/${dark}|${hit}]`;
  }

  frame(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode);
    let slot = itemBuffer[5];
    let def = itemBuffer[6];
    let defMaxAddition = this.getAddition(name, this.config.FrameAdditions, this.config.AdditionType.DEF);
    let avoid = itemBuffer[8];
    let avoidMaxAddition = this.getAddition(name, this.config.FrameAdditions, this.config.AdditionType.AVOID);
    return `${name} [${def}/${defMaxAddition}|${avoid}/${avoidMaxAddition}] [${slot}S]`;
  }

  barrier(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode);
    let def = itemBuffer[6];
    let defMaxAddition = this.getAddition(name, this.config.BarrierAdditions, this.config.AdditionType.DEF);
    let avoid = itemBuffer[8];
    let avoidMaxAddition = this.getAddition(name, this.config.BarrierAdditions, this.config.AdditionType.DEF);
    return `${name} [${def}/${defMaxAddition}|${avoid}/${avoidMaxAddition}]`;
  }

  unit(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode);
    return name;
  }

  mag(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode.substring(0, 4) + "00");
    let level = itemBuffer[2];
    let sync = itemBuffer[16];
    let iq = itemBuffer[17];
    let collor = this.config.MagCollorCodes[itemBuffer[19]];
    let def = this.joinArray([itemBuffer[5], itemBuffer[4]]) / 100;
    let pow = this.joinArray([itemBuffer[7], itemBuffer[6]]) / 100;
    let dex = this.joinArray([itemBuffer[9], itemBuffer[8]]) / 100;
    let mind = this.joinArray([itemBuffer[11], itemBuffer[10]]) / 100;
    // pbsの要素は0=center, 1=right、2=left
    let pbs = this.getPbs(this.joinArrayToString([itemBuffer[3], itemBuffer[18]]));

    return `${name} LV${level} [${collor}] [${def}/${pow}/${dex}/${mind}] [${pbs[2]}|${pbs[0]}|${pbs[1]}]`;
  }

  disk(itemCode, itemBuffer)
  {
    let name = this.config.DiskNameCodes[itemBuffer[4]];
    let level = itemBuffer[2] + 1;
    return `${name} LV${level} disk`;
  }

  sRankWeapon(itemCode, itemBuffer)
  {
    let name = this.config.SRankWeaponCodes[parseInt(itemCode.substring(0, 4) + "00", 16)];
    let grinder = itemBuffer[3];
    let element = this.getSrankElement(itemBuffer);

    return `S-RANK ${name}${this.grinderLabel(grinder)} [${element}]`;
  }

  tool(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode);
    let number = 0;
    (itemBuffer.length === 28)
      // イベントリの場合
      ? number = itemBuffer[5]
      // 倉庫の場合
      : number = itemBuffer[20];

    return `${name}${this.numberLabel(number)}`;
  }

  reinforcement(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode);
    (itemBuffer.length === 28)
      // イベントリの場合
      ? number = itemBuffer[5]
      // 倉庫の場合
      : number = itemBuffer[20];

    return `${name}${this.numberLabel(number)}`;
  }

  other(itemCode, itemBuffer)
  {
    let name = this.getItemName(itemCode);
    let number = 0;
    (itemBuffer.length === 28)
      // イベントリの場合
      ? number = itemBuffer[5]
      // 倉庫の場合
      : number = itemBuffer[20];

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

  getElement(itemBuffer)
  {
      let elementCode = itemBuffer[4];
      if (elementCode in this.config.ElementCodes)
      {
          return this.config.ElementCodes[elementCode];
      }

      return "undefined";
  }

  getSrankElement(itemBuffer)
  {
      let elementCode = itemBuffer[2];
      if (elementCode in this.config.SrankElementCodes)
      {
          return this.config.SrankElementCodes[elementCode];
      }

      return "undefined";
  }

  getNative(itemBuffer)
  {
    return this.getAttribute(this.config.AttributeType["native"], itemBuffer);
  }
  getABeast(itemBuffer)
  {
    return this.getAttribute(this.config.AttributeType["aBeast"], itemBuffer);
  }
  getMachine(itemBuffer)
  {
    return this.getAttribute(this.config.AttributeType["machine"], itemBuffer);
  }
  getDark(itemBuffer)
  {
    return this.getAttribute(this.config.AttributeType["dark"], itemBuffer);
  }
  getHit(itemBuffer)
  {
    return this.getAttribute(this.config.AttributeType["hit"], itemBuffer);
  }

  getAttribute(attributeType, itemBuffer)
  {
    let attributes =
    [
        // ひとつめの属性値
        itemBuffer.slice(6, 8),
        // ふたつめの属性値
        itemBuffer.slice(8, 10),
        // みっつめの属性値
        itemBuffer.slice(10, 12),
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

  joinArray(arr){
    let str = '';
    for(let el of arr)
    {
      str += el.toString('16').padStart(2, '0')
    }
    return parseInt(Number("0x" + str.padStart(6, '0')), 10)
  }

  joinArrayToString(arr){
    let str = '';
    for(let el of arr)
    {
      if (el == 0)
      {
        str += "00"
      } else {
        str += el.toString('16').padStart(2, '0')
      }
    }
    return str.toUpperCase();
  }

}
