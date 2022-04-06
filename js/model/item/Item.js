class Item {

  Config;
  Item;

  constructor(itemData, itemCode, lang)
  {
    // コンフィグ設定
    this.Config = new Config(lang);

    // アイテムの種類を取得（武器、鎧、テクニックなど）
    let itemType = this.getItemType(itemCode);
    console.log("item type:" + itemType);

    this.Item = this.createItem(itemData, itemCode, itemType);
  };

  createItem(itemData, itemCode, itemType, lang)
  {
    switch(itemType) {
      case (this.Config.ItemType.SRANK_WEAPON):
        return this.sRankWeapon(itemCode, itemData);
      case (this.Config.ItemType.WEAPON):
        return this.weapon(itemCode, itemData);
      case (this.Config.ItemType.FRAME):
        return this.frame(itemCode, itemData);
      case (this.Config.ItemType.BARRIER):
        return this.barrier(itemCode, itemData);
      case (this.Config.ItemType.UNIT):
        return this.unit(itemCode, itemData);
      case (this.Config.ItemType.MAG):
        return this.mag(itemCode, itemData);
      case (this.Config.ItemType.DISK):
        return this.disk(itemCode, itemData);
      case (this.Config.ItemType.TOOL):
        return this.tool(itemCode, itemData);
      case (this.Config.ItemType.OTHER):
        return this.other(itemCode, itemData);
      default:
        return `unknown. (${itemCode}). There's a possibility that New Ephinea Item`;
    }
  }

  getItemType(itemCode)
  {
    if (this.isSRankWeapon(itemCode)) return this.Config.ItemType.SRANK_WEAPON;
    if (this.isWeapon(itemCode)) return this.Config.ItemType.WEAPON;
    if (this.isFrame(itemCode)) return this.Config.ItemType.FRAME;
    if (this.isBarrier(itemCode)) return this.Config.ItemType.BARRIER;
    if (this.isUnit(itemCode)) return this.Config.ItemType.UNIT;
    if (this.isMag(itemCode)) return this.Config.ItemType.MAG;
    if (this.isDisk(itemCode)) return this.Config.ItemType.DISK;
    if (this.isTool(itemCode)) return this.Config.ItemType.TOOL;
    return this.Config.ItemType.OTHER;
  }

  isSRankWeapon(itemCode)
  {
    return (this.Config.SRankWeaponRange[0] <= parseInt(itemCode.substring(0, 4), 16) && parseInt(itemCode.substring(0, 4), 16) <= this.Config.SRankWeaponRange[1]);
  }
  isWeapon(itemCode)
  {
    return (this.Config.WeaponRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.Config.WeaponRange[1]);
  }
  isCommonWeapon(itemCode)
  {
    // コモン武器が含まれている最小アイテムコード以下、かつコモン武器のグレード数以下であること
    return (parseInt(itemCode, 16) <= this.Config.CommonWeaponContainsCode && parseInt(itemCode.substring(4, 6), 16) <= this.Config.CommonWeaponsMaxCode);
  }
  isFrame(itemCode)
  {
    return (this.Config.FrameRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.Config.FrameRange[1]);
  }
  isBarrier(itemCode)
  {
    return (this.Config.BarrierRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.Config.BarrierRange[1]);
  }
  isUnit(itemCode)
  {
    return (this.Config.UnitRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.Config.UnitRange[1]);
  }
  isMag(itemCode)
  {
    return (this.Config.MagRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.Config.MagRange[1]);
  }
  isDisk(itemCode)
  {
    return (parseInt(itemCode.substring(0, 4), 16) == this.Config.DiskCode);
  }
  isTool(itemCode)
  {
    return (this.Config.ToolRange[0] <= parseInt(itemCode, 16) && parseInt(itemCode, 16) <= this.Config.ToolRange[1]);
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
    // コモン武器の場合はエレメントの設定をする。elementがない場合は設定しない。
    let element = "";
    if (this.isCommonWeapon(itemCode) & itemData[4] !== 0x00) element = ` [${this.getElement(itemData)}]`;

    let tekkedMode = this.isTekked(itemData, itemCode);
    let tekkedText = "";
    // 未鑑定の場合は未鑑定表記する
    if (!tekkedMode) tekkedText = "?";
    if (!tekkedMode & this.isCommonWeapon(itemCode)) tekkedText = "????";

    return {
      type: "w",
      name: name,
      element: element,
      grinder: grinder,
      attribute: {
        native: native,
        aBeast: aBeast,
        machine: machine,
        dark: dark,
        hit: hit
      },
      tekked: tekkedMode,
      display: `${tekkedText} ${name}${this.grinderLabel(grinder)}${element} [${native}/${aBeast}/${machine}/${dark}|${hit}]`,
    }
  }

  frame(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    let slot = itemData[5];
    let def = itemData[6];
    let defMaxAddition = this.getAddition(name, this.Config.FrameAdditions, this.Config.AdditionType.DEF);
    let avoid = itemData[8];
    let avoidMaxAddition = this.getAddition(name, this.Config.FrameAdditions, this.Config.AdditionType.AVOID);

    return {
      type: "f",
      name: name,
      slot: slot,
      status: {
        def: def,
        avoid: avoid,
      },
      addition: {
        def: defMaxAddition,
        avoid: avoidMaxAddition,
      },
      display: `${name} [${def}/${defMaxAddition}|${avoid}/${avoidMaxAddition}] [${slot}S]`
    }
  }

  barrier(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    let def = itemData[6];
    let defMaxAddition = this.getAddition(name, this.Config.BarrierAdditions, this.Config.AdditionType.DEF);
    let avoid = itemData[8];
    let avoidMaxAddition = this.getAddition(name, this.Config.BarrierAdditions, this.Config.AdditionType.AVOID);

    return {
      type: "b",
      name: name,
      addition: {
        def: def,
        avoid: avoid,
      },
      maxAddition: {
        def: defMaxAddition,
        avoid: avoidMaxAddition,
      },
      display: `${name} [${def}/${defMaxAddition}|${avoid}/${avoidMaxAddition}]`
    }
  }

  unit(itemCode, itemData)
  {
    let name = this.getItemName(itemCode);
    return {
      type: "u",
      name: name,
      display: name
    }
  }

  mag(itemCode, itemData)
  {
    let name = this.getItemName(itemCode.substring(0, 4) + "00");
    let level = itemData[2];
    let sync = itemData[16];
    let iq = itemData[17];
    let collor = this.Config.MagCollorCodes[itemData[19]];
    let def = this.binArrayToInt([itemData[5], itemData[4]]) / 100;
    let pow = this.binArrayToInt([itemData[7], itemData[6]]) / 100;
    let dex = this.binArrayToInt([itemData[9], itemData[8]]) / 100;
    let mind = this.binArrayToInt([itemData[11], itemData[10]]) / 100;
    // pbsの要素は0=center, 1=right、2=left
    let pbs = this.getPbs(this.binArrayToString([itemData[3], itemData[18]]));

    return {
      type: "m",
      name: name,
      level: level,
      sync: sync,
      iq: iq,
      collor: collor,
      status: {
        def: def,
        pow: pow,
        dex: dex,
        mind: mind
      },
      pds: [
        pbs[0],
        pbs[1],
        pbs[2]
      ],
      display: `${name} LV${level} [${collor}] [${def}/${pow}/${dex}/${mind}] [${pbs[2]}|${pbs[0]}|${pbs[1]}]`
    }
  }

  disk(itemCode, itemData)
  {
    let name = this.Config.DiskNameCodes[itemData[4]];
    let level = itemData[2] + 1;
    return {
      type: "d",
      name: name,
      level: level,
      display: `${name} LV${level} Disk`
    }
  }

  sRankWeapon(itemCode, itemData)
  {
    let name = this.Config.SRankWeaponCodes[parseInt(itemCode.substring(0, 4) + "00", 16)];
    let grinder = itemData[3];
    let element = this.getSrankElement(itemData);

    return {
      type: "s",
      name: name,
      grinder: grinder,
      element: element,
      display: `S-RANK ${name}${this.grinderLabel(grinder)} [${element}]`
    }
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

    return {
      type: "t",
      name: name,
      number: number,
      display: `${name}${this.numberLabel(number)}`
    }
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
    return {
      type: "o",
      name: name,
      number: number,
      display: `${name}${this.numberLabel(number)}`
    }
  }

  getItemName(itemCode)
  {
    itemCode = "0x" + itemCode;

    if (itemCode in this.Config.ItemCodes)
    {
      return this.Config.ItemCodes[itemCode];
    }
    return `undefined. (${itemCode})`;
  }

  getElement(itemData)
  {
      let code = itemData[4];
      if (code in this.Config.ElementCodes)
      {
          return this.Config.ElementCodes[code];
      }

      return "undefined";
  }

  getSrankElement(itemData)
  {
      let elementCode = itemData[2];
      if (elementCode in this.Config.SrankElementCodes)
      {
          return this.Config.SrankElementCodes[elementCode];
      }

      return "undefined";
  }

  getNative(itemData)
  {
    return this.getAttribute(this.Config.AttributeType["native"], itemData);
  }
  getABeast(itemData)
  {
    return this.getAttribute(this.Config.AttributeType["aBeast"], itemData);
  }
  getMachine(itemData)
  {
    return this.getAttribute(this.Config.AttributeType["machine"], itemData);
  }
  getDark(itemData)
  {
    return this.getAttribute(this.Config.AttributeType["dark"], itemData);
  }
  getHit(itemData)
  {
    return this.getAttribute(this.Config.AttributeType["hit"], itemData);
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
            return new Int8Array(attributes[i])[1];
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

  isTekked(itemData, itemCode)
  {
    // コモン武器でエレメントが設定されている場合
    if (this.isCommonWeapon(itemCode) & itemData[4] !== 0x00)
    {
      return (!(itemData[14] === 0x81 | itemData[14] === 0x21))
    }
    return (itemData[4] !== 0x80)
  }

  getPbs(pbsCode)
  {
    if (pbsCode in this.Config.PBs)
    {
        return this.Config.PBs[pbsCode];
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
