class Item {

  Item;

  constructor(itemData, itemCode, lang)
  {
    // コンフィグ設定
    Config.init(lang);

    // アイテムの種類を取得（武器、鎧、テクニックなど）
    const itemType = this.getItemType(itemCode);
    console.log("item type:" + itemType);

    this.Item = this.createItem(itemData, itemCode, itemType);
  };

  createItem(itemData, itemCode, itemType, lang)
  {
    switch(itemType) {
      case (Config.ItemType.SRANK_WEAPON):
        return this.sRankWeapon(itemCode, itemData);
      case (Config.ItemType.WEAPON):
        return this.weapon(itemCode, itemData);
      case (Config.ItemType.FRAME):
        return this.frame(itemCode, itemData);
      case (Config.ItemType.BARRIER):
        return this.barrier(itemCode, itemData);
      case (Config.ItemType.UNIT):
        return this.unit(itemCode, itemData);
      case (Config.ItemType.MAG):
        return this.mag(itemCode, itemData);
      case (Config.ItemType.DISK):
        return this.disk(itemCode, itemData);
      case (Config.ItemType.TOOL):
        return this.tool(itemCode, itemData);
      case (Config.ItemType.OTHER):
        return this.other(itemCode, itemData);
      default:
        return `unknown. (${itemCode}). There's a possibility that New Ephinea Item`;
    }
  }

  getItemType(itemCode)
  {
    if (this.isSRankWeapon(itemCode)) return Config.ItemType.SRANK_WEAPON;
    if (this.isWeapon(itemCode)) return Config.ItemType.WEAPON;
    if (this.isFrame(itemCode)) return Config.ItemType.FRAME;
    if (this.isBarrier(itemCode)) return Config.ItemType.BARRIER;
    if (this.isUnit(itemCode)) return Config.ItemType.UNIT;
    if (this.isMag(itemCode)) return Config.ItemType.MAG;
    if (this.isDisk(itemCode)) return Config.ItemType.DISK;
    if (this.isTool(itemCode)) return Config.ItemType.TOOL;
    return Config.ItemType.OTHER;
  }

  isSRankWeapon(itemCode)
  {
    return (Config.SRankWeaponRange[0] <= itemCode >> 8 && itemCode >> 8 <= Config.SRankWeaponRange[1]);
  }
  isWeapon(itemCode)
  {
    return (Config.WeaponRange[0] <= itemCode && itemCode <= Config.WeaponRange[1]);
  }
  isCommonWeapon(itemCode)
  {
    // コモン武器が含まれている最小アイテムコード以下、かつコモン武器のグレード数以下であること
    return (itemCode <= Config.CommonWeaponContainsCode && itemCode & 0x00FFFF <= Config.CommonWeaponsMaxCode);
  }
  isFrame(itemCode)
  {
    return (Config.FrameRange[0] <= itemCode && itemCode <= Config.FrameRange[1]);
  }
  isBarrier(itemCode)
  {
    return (Config.BarrierRange[0] <= itemCode && itemCode <= Config.BarrierRange[1]);
  }
  isUnit(itemCode)
  {
    return (Config.UnitRange[0] <= itemCode && itemCode <= Config.UnitRange[1]);
  }
  isMag(itemCode)
  {
    return (Config.MagRange[0] <= itemCode && itemCode <= Config.MagRange[1]);
  }
  isDisk(itemCode)
  {
    return (itemCode >> 8 == Config.DiskCode);
  }
  isTool(itemCode)
  {
    return (Config.ToolRange[0] <= itemCode && itemCode <= Config.ToolRange[1]);
  }

  weapon(itemCode, itemData)
  {

    const name = this.getItemName(itemCode);
    const grinder = itemData[3];
    const native = this.getNative(itemData);
    const aBeast = this.getABeast(itemData);
    const machine = this.getMachine(itemData);
    const dark = this.getDark(itemData);
    const hit = this.getHit(itemData);
    // コモン武器の場合はエレメントの設定をする。elementがない場合は設定しない。
    let element = "";
    if (itemData[4] !== 0x00 & itemData[4] !== 0x80) element = ` [${this.getElement(itemData)}]`;

    const tekkedMode = this.isTekked(itemData, itemCode);
    let tekkedText = "";
    // 未鑑定の場合は未鑑定表記する
    if (!tekkedMode) tekkedText = "? ";
    if (!tekkedMode & this.isCommonWeapon(itemCode)) tekkedText = "???? ";

    return {
      type: 1,
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
      display: `${tekkedText}${name}${this.grinderLabel(grinder)}${element} [${native}/${aBeast}/${machine}/${dark}|${hit}]`,
    }
  }

  frame(itemCode, itemData)
  {
    const name = this.getItemName(itemCode);
    const slot = itemData[5];
    const def = itemData[6];
    const defMaxAddition = this.getAddition(name, Config.FrameAdditions, Config.AdditionType.DEF);
    const avoid = itemData[8];
    const avoidMaxAddition = this.getAddition(name, Config.FrameAdditions, Config.AdditionType.AVOID);

    return {
      type: 2,
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
    const name = this.getItemName(itemCode);
    const def = itemData[6];
    const defMaxAddition = this.getAddition(name, Config.BarrierAdditions, Config.AdditionType.DEF);
    const avoid = itemData[8];
    const avoidMaxAddition = this.getAddition(name, Config.BarrierAdditions, Config.AdditionType.AVOID);

    return {
      type: 3,
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
    const name = this.getItemName(itemCode);
    return {
      type: 4,
      name: name,
      display: name
    }
  }

  mag(itemCode, itemData)
  {
    const name = this.getItemName(itemCode & 0xFFFF00);
    const level = itemData[2];
    const sync = itemData[16];
    const iq = itemData[17];
    const color = Config.MagColorCodes[itemData[19]];
    const def = (itemData[5] << 8 | itemData[4]) / 100;
    const pow = (itemData[7] << 8 | itemData[6]) / 100;
    const dex = (itemData[9] << 8 | itemData[8]) / 100;
    const mind = (itemData[11] << 8 | itemData[10]) / 100;
    // pbsの要素は0=center, 1=right、2=left
    const pbs = this.getPbs(this.binaryArrayToHex([itemData[3], itemData[18]]));

    return {
      type: 5,
      name: `${name} LV${level} [${color}]`,
      level: level,
      sync: sync,
      iq: iq,
      color: color[1],
      rgb: color[0],
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
      display: `${name} LV${level} [${color[1]}] [${def}/${pow}/${dex}/${mind}] [${pbs[2]}|${pbs[0]}|${pbs[1]}]`,
      display_front: `${name} LV${level} [${color[1]}`,
      display_end: `] [${def}/${pow}/${dex}/${mind}] [${pbs[2]}|${pbs[0]}|${pbs[1]}]`
    }
  }

  disk(itemCode, itemData)
  {

    const name = Config.DiskNameCodes[itemData[4]];
    const level = itemData[2] + 1;
    return {
      type: 6,
      name: `${name} LV${level} ${Config.DiskNameLanguage}`,
      level: level,
      display: `${name} LV${level} ${Config.DiskNameLanguage}`
    }
  }

  sRankWeapon(itemCode, itemData)
  {

    const cumstomName = this.getCustomName(itemData.slice(6, 12));
    const name = `S-RANK ${cumstomName} ${Config.SRankWeaponCodes[itemCode & 0xFFFF00]}`;
    const grinder = itemData[3];
    const element = this.getSrankElement(itemData);

    return {
      type: 8,
      name: name,
      grinder: grinder,
      element: element,
      display: `${name} ${this.grinderLabel(grinder)} [${element}]`
    }
  }

  tool(itemCode, itemData)
  {
    const name = this.getItemName(itemCode);
    let number = 0;
    (itemData.length === 28)
      // イベントリの場合
      ? number = itemData[5]
      // 倉庫の場合
      : number = itemData[20];

    return {
      type: 7,
      name: name,
      number: number,
      display: `${name}${this.numberLabel(number)}`
    }
  }

  other(itemCode, itemData)
  {
    const name = this.getItemName(itemCode);
    let number = 0;
    (itemData.length === 28)
      // イベントリの場合
      ? number = itemData[5]
      // 倉庫の場合
      : number = itemData[20];
    return {
      type: 9,
      name: name,
      number: number,
      display: `${name}${this.numberLabel(number)}`
    }
  }

  getItemName(itemCode)
  {

    if (itemCode in Config.ItemCodes)
    {

      return Config.ItemCodes[itemCode];
    }
    return `undefined. (${itemCode})`;
  }

  getElement(itemData)
  {
      let code = itemData[4];
      if (code in Config.ElementCodes)
      {
          return Config.ElementCodes[code];
      }

      return "undefined";
  }

  getSrankElement(itemData)
  {
      let elementCode = itemData[2];
      if (elementCode in Config.SrankElementCodes)
      {
          return Config.SrankElementCodes[elementCode];
      }

      return "undefined";
  }

  getNative(itemData)
  {
    return this.getAttribute(Config.AttributeType["native"], itemData);
  }
  getABeast(itemData)
  {
    return this.getAttribute(Config.AttributeType["aBeast"], itemData);
  }
  getMachine(itemData)
  {
    return this.getAttribute(Config.AttributeType["machine"], itemData);
  }
  getDark(itemData)
  {
    return this.getAttribute(Config.AttributeType["dark"], itemData);
  }
  getHit(itemData)
  {
    return this.getAttribute(Config.AttributeType["hit"], itemData);
  }

  getAttribute(attributeType, itemData)
  {
    const attributes =
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
    if (this.isCommonWeapon(itemCode)) return (itemData[4] < 0x80)
    return (itemData[4] !== 0x80)
  }

  getPbs(pbsCode)
  {
    if (pbsCode in Config.PBs)
    {
        return Config.PBs[pbsCode];
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


  getCustomName(cumstomNameData)
  {
    // 名前格納用
    let temp = [];

    // ２文字目（実質１文字目）が小文字データなので大文字に戻す
    cumstomNameData[0] -= 0x04;
    // ３文字＊３回取得するが、１文字目は空なので実質８文字
    temp = temp.concat(this.threeLetters(cumstomNameData.slice(0, 2)));
    temp = temp.concat(this.threeLetters(cumstomNameData.slice(2, 4)));
    temp = temp.concat(this.threeLetters(cumstomNameData.slice(4, 6)));

    console.log("customname int:");
    console.log(temp);

    // １文字ずつアルファベットに変換
    // 1 -> A, 26 -> Zのようになる。 0はSkip
    let customname = "";
    for (let value of temp) {
      if (value !== 0) customname += String.fromCharCode(value + 64);
    };

    console.log("customname string:");
    console.log(customname);

    return customname;

  }

  threeLetters(array)
  {
    // 計算に関係のない初期データを削除
    array[0] = (array[0] - 0x80);
    const first = Math.floor(array[0] / 0x04);
    const second = Math.floor(((array[0] % 0x04) << 8 | array[1]) / 0x20);
    const third = array[1] % 0x20;
    return [
      first,
      second,
      third
    ];
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
