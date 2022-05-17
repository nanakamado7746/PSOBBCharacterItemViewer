class Config {
  // 全アイテムコードは長いのでjsを分けて取得
  static ItemCodes;
  static ElementCodes;
  static SrankElementCodes;
  static FrameAdditions;
  static BarrierAdditions;
  static DiskNameCodes;
  static DiskNameLanguage;
  static PBs;
  static MagColorCodes;
  static WeaponRange = [ 0x000000, 0x00ED00 ];
  static FrameRange = [ 0x010100, 0x010158 ];
  static BarrierRange = [ 0x010200, 0x0102A5 ];
  static UnitRange = [ 0x010300, 0x010364 ];
  static MagRange = [ 0x020000, 0x025200 ];
  static ToolRange = [ 0x030000, 0x030102 ];
  static MesetaRange = [ 0x040000, 0x040000 ];
  static DiskRange = [ 0x050000, 0x05121D ];
  static EphineaRange = [ 0x031005, 0x031810 ];
  static SRankWeaponRange = [ 0x0070, 0x0088 ];
  static DiskCode = 0x0302;
  static CommonWeaponContainsCode = 0x000C03;
  static CommonWeaponsMaxCode = 0x04;

  static ItemType = {
    WEAPON : 1,
    FRAME : 2,
    BARRIER : 3,
    UNIT : 4,
    MAG : 5,
    DISK : 6,
    TOOL : 7,
    SRANK_WEAPON : 8,
    OTHER : 9,
    MESETA : 10,
  };

  static AdditionType = {
    DEF : 0,
    AVOID : 1
  };

  static Classes = {
    0x00 : "HUmar",
    0x01 : "Hunewearl",
    0x02 : "HUcast",
    0x03 : "RAmar",
    0x04 : "RAcast",
    0x05 : "RAcaseal",
    0x06 : "FOmarl",
    0x07 : "FOnewm",
    0x08 : "FOnewearl",
    0x09 : "HUcaseal",
    0x0A : "FOmar",
    0x0B : "RAmarl",
  };

  static Titles = {
    1 : "Ra-GOU",
    2 : "Gi-GOU",
    3 : "Bu-GOU",
    4 : "Ra-ZAN",
    5 : "Gi-ZAN",
    6 : "Bu-ZAN",
    7 : "Ra-EI",
    8 : "Gi-EI",
    9 : "Bu-EI",
  };

  static SectionIDs = {
    0x00 : "VIRIDIA",
    0x01 : "GREENILL",
    0x02 : "SKYLY",
    0x03 : "BLUEFULL",
    0x04 : "PURPLENUM",
    0x05 : "PINKAL",
    0x06 : "REDRIA",
    0x07 : "ORAN",
    0x08 : "YELLOWBOZE",
    0x09 : "WHITILL",
    0x0A : "VIRIDIA",
  };

  static AttributeType = {
    "native": 0x01,
    "aBeast": 0x02,
    "machine": 0x03,
    "dark": 0x04,
    "hit": 0x05,
  }

  static MagColorCodes = {
    0x00: "Red",
    0x01: "Blue",
    0x02: "Yellow",
    0x03: "Green",
    0x04: "Purple",
    0x05: "Black",
    0x06: "White",
    0x07: "Cyan",
    0x08: "Brown",
    0x09: "Orange",
    0x0A: "Slate Blue",
    0x0B: "Olive",
    0x0C: "Turqoise",
    0x0D: "Fuschia",
    0x0E: "Grey",
    0x0F: "Cream",
    0x10: "Pink",
    0x11: "Dark Green",
    0x12: "Chartreuse",
    0x13: "Azure",
    0x14: "Royal Purple",
    0x15: "Ruby",
    0x16: "Sapphire",
    0x17: "Emerald",
    0x18: "Gold",
    0x19: "Silver",
    0x1A: "Bronze",
    0x1B: "Plum",
    0x1C: "Violet",
    0x1D: "Goldenrod"
  }

  static SRankWeaponCodes = {
    0x007000: "SABER",
    0x007100: "SWORD",
    0x007200: "BLADE",
    0x007300: "PARTISAN",
    0x007400: "SLICER",
    0x007500: "GUN",
    0x007600: "RIFLE",
    0x007700: "MECHGUN",
    0x007800: "SHOT",
    0x007900: "CANE",
    0x007A00: "ROD",
    0x007B00: "WAND",
    0x007C00: "TWIN",
    0x007D00: "CLAW",
    0x007E00: "BAZOOKA",
    0x007F00: "NEEDLE",
    0x008000: "SCYTHE",
    0x008100: "HAMMER",
    0x008200: "MOON",
    0x008300: "PSYCHOGUN",
    0x008400: "PUNCH",
    0x008500: "WINDMILL",
    0x008600: "HARISEN",
    0x008700: "J-BLADE",
    0x008800: "J-CUTTER",
    0x00A500: "SOWRDS",
    0x00A600: "LAUNCHER",
    0x00A700: "CARDS",
    0x00A800: "KNUCKLE",
    0x00A900: "AXE"
  }

  static init(mode)
  {
    switch (mode) {
      case "JA":
        this.ItemCodes = ItemCodes_JA();
        this.ElementCodes = ElementCodes_JA();
        this.SrankElementCodes = SrankElementCodes_JA();
        this.FrameAdditions = FrameAdditions_JA();
        this.BarrierAdditions = BarrierAdditions_JA();
        this.DiskNameCodes = DiskNameCodes_JA();
        this.DiskNameLanguage = DiskNameLanguage_JA();
        this.PBs = PBs_JA();
        this.MagColorCodes = MagColorCodes_JA();
      break;

      default:
        this.ItemCodes = ItemCodes();
        this.ElementCodes = ElementCodes();
        this.SrankElementCodes = SrankElementCodes();
        this.FrameAdditions = FrameAdditions();
        this.BarrierAdditions = BarrierAdditions();
        this.DiskNameCodes = DiskNameCodes();
        this.DiskNameLanguage = DiskNameLanguage();
        this.PBs = PBs();
        this.MagColorCodes = MagColorCodes();
    }
  }

}
