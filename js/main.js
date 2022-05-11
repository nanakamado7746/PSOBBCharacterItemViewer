// 入力データ
var fileData = [];
var itemCodeData = [];
var lang = "EN";
// デコード済みデータ
var characters = [];
var shareBanks = [];
var allItems = [];
var searchResults = [];

var currentData = {};

var cursor_audios = [
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
]

var cancel_audios = [
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
]

var open_audios = [
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav")
]

var enter_audios = [
  new Audio("./resources/sounds/se/enter.wav")
]


// 初期表示
initializeLang();
initializeDisplay();
displayNotification();
initializeTheme();
initializeVolume();

function decoder()
{
  if (this.fileData.length === 0) return;

  let fileData = this.fileData;
  let characters = [];
  let shareBanks = [];
  let allItems = {
      "JA" : [],
      "EN" : []
    };

  for (let i in fileData)
  {
    let binary = Object.values(fileData[i]["binary"]);

    // 共有倉庫ファイルをデコード
    if (fileData[i]["filename"].match(/psobank/) !== null)
    {
      let shareBank = new ShareBank(binary, "Share Bank");
      shareBanks.push(shareBank);
      allItems["EN"] = allItems["EN"].concat(shareBank.ShareBank["EN"]);
      allItems["JA"] = allItems["JA"].concat(shareBank.ShareBank["JA"]);
      continue;
    }

    //　キャラクターファイルをデコード
    if (fileData[i]["filename"].match(/psochar/) !== null)
    {
      let slot = fileData[i]["filename"].match(/[0-9]+(?=\.)/);
      let charactor = new Charactor(binary, Number(slot) + 1);
      characters.push(charactor);

      allItems["EN"] = allItems["EN"].concat(charactor.Inventory["EN"]);
      allItems["EN"] = allItems["EN"].concat(charactor.Bank["EN"]);
      allItems["JA"] = allItems["JA"].concat(charactor.Inventory["JA"]);
      allItems["JA"] = allItems["JA"].concat(charactor.Bank["JA"]);
    }
  }

  // ソート
  allItems["EN"] = allItems["EN"].sort();
  allItems["JA"] = allItems["JA"].sort();

  allItems["EN"].forEach(function(value, i){
    value.push(i);
  })
  allItems["JA"].forEach(function(value, i){
    value.push(i);
  })

  console.log(allItems);

  // グローバル変数初期化
  removeCharactorData();
  // グローバル変数とローカルストレージにセット
  setCharactorData(characters, shareBanks, allItems);
}


function setCharactorData(characters, shareBanks, allItems)
{
  if (characters.length !== 0)
  {
    this.characters = characters;
    console.log(characters);
  }

  if (shareBanks.length !== 0)
  {
    this.shareBanks = shareBanks;
    console.log(shareBanks);
  }

  if (allItems.length !== 0)
  {
    this.allItems = allItems;
    console.log(allItems);
  }
}

// FileListをファイル名の照準にする
function sortInputFiles(files)
{
  let sorted = [].slice.call(files).sort(function(a, b) {
    if (a.name.match(/psobank/)) return -1;

    // ファイル名のスロット番号を切り取って数値に変換する
    if (a.name.match(/\s\d+/) != null) {
      a = parseInt(a.name.match(/[0-9]+(?=\.)/));
    }
    if (b.name.match(/\s\d+/) != null){
      b = parseInt(b.name.match(/[0-9]+(?=\.)/));
    }

    if ( a > b ) {
      return 1;
    } else if ( a < b )
    {
      return -1;
    } else {
      return 0;
    }
  });
  return sorted;
}

function getInputItemCodes(list)
{
  let itemCodes = {};
  let ephinea  = true;
  let other = false;
  for (let i in list) {
    other = (list[i].match(/then.+(Vanilla|Ultima|Schthack)/) != null)

    if (other | !ephinea) {
      if ((list[i].match(/then.+(Ephinea)/) != null)){
        ephinea = true;
      } else {
        ephinea = false;
        continue;
      }
    }

    if (list[i].match(/(^.+|^)t\[ /) != null)
    {
      let name = list[i].match(/0x([0-9]|[A-Z]){6}/)[0];
      let value = list[i].match(/(?<=--( |\t)).*$/)[0];
      itemCodes[name.toString()] = value;
    }
  }
  return itemCodes;
}

function setItemCodes(itemCodeData)
{
  this.itemCodeData = itemCodeData;
  localStorage.setItem("itemCodeData", JSON.stringify(itemCodeData));
}

function getDate()
{
  let date = new Date();
  return date.toLocaleString();
}

function removeCharactorData()
{
  this.characters = [];
  this.shareBanks = [];
  this.allItems = [];
}

function clicVolumeSlider(value)
{
  document.getElementById("theme")
  setVolume(value);
}

function clicVolumeImage()
{
  let range = document.getElementById("volume_range");
  console.log(range.value);
  if( Number(range.value) === 0)
  {
    range.setAttribute('value', 1);
    setItemVolume(1);
  } else {
    range.setAttribute('value', 0);
    setVolume(0);
  }
}

function setVolume(value)
{
  console.log("change volume to:" + value);

  let img = document.getElementById("volume_img");
  (value > 0)
    ? img.setAttribute('src', "./resources/images/icon/volume_on.png")
    : img.setAttribute('src', "./resources/images/icon/volume_off.png");

  this.cursor_audios.map(item => item.volume = value);
  this.open_audios.map(item => item.volume = value);
  this.enter_audios.map(item => item.volume = value);
  this.cancel_audios.map(item => item.volume = value);

  setCursorAudio();
}

function setCursorAudio()
{
  let els = document.getElementsByClassName("data_cursor");
  for (let el of els)
  {
    el.onmouseover = function() {
      if (document.getElementById("volume_range").value > 0) {
        playAudioCursor();
      }
    }
  }
}

function refreshVolume()
{
  (document.getElementsByName("themes")[0].checked)
   ? setVolume(document.getElementById("volume_range").value)
   : setVolume(0);
}

function playAudio()
{
  if (isClassicTheme()) {
    let sound = new Audio("./resources/sounds/se/open.wav");
    sound.play();
  }
}

function playAudio(audios)
{
  if (isClassicTheme()) {
    for (const audio of audios)
    {
      if (audio.ended) audio.currentTime = 0;
      if (audio.currentTime !== 0) continue;
      audio.currentTime = 0;
      audio.play();
      break;
    }
  }
}

function playAudioOpen()
{
  playAudio(this.open_audios);
}

function playAudioCursor()
{
  playAudio(this.cursor_audios);
}

function playAudioCancel()
{
  playAudio(this.cancel_audios);
}

function playAudioEnter()
{
}


function createCurrentPageDataFile(zip, currentData)
{
  if (currentData["page"] === "character") return createCharacterDataFile(zip, currentData["searching"][2], "psobb_character_data");
  if (currentData["page"] === "shareBank") return createShareBanksDataFile(zip, currentData["searching"][2]["ShareBank"][this.lang], "psobb_character_data");
  if (currentData["page"] === "allItems") return createAllItemsDataFile(zip, currentData["searching"][2][this.lang], "psobb_character_data");
  if (currentData["page"] === "searchResults") return createSearchResultsDataFile(zip, currentData["searchResults"], "psobb_character_data");
  return zip;
}

function createCharacterDataFile(zip, character, folder)
{
    let character_data = [
      "SLOT : " + character.Slot,
      "NAME : " + character.Name,
      "GUILD CARD : " + character.GuildCardNumber,
      "CLASS : " + character.Class,
      "SECTION ID : " + character.SectionID,
      "LEVEL : " + character.Level,
      "EP1 CHALLENGE : " + character.Ep1Progress,
      "EP2 CHALLENGE : " + character.Ep2Progress
    ];
    zip.addFile(new TextEncoder().encode(character_data.join("\r\n")), {
      filename: new TextEncoder().encode(`${folder}/${character.Slot}/character.txt`)
    });

    let inventory = character["Inventory"][this.lang].map(item => item[1]["display"]).join("\r\n");
    zip.addFile(new TextEncoder().encode(inventory), {
      filename: new TextEncoder().encode(`${folder}/${character.Slot}/inventory.txt`)
    });

    let bank = character["Bank"][this.lang].map(item => item[1]["display"]).join("\r\n");
    zip.addFile(new TextEncoder().encode(bank), {
      filename: new TextEncoder().encode(`${folder}/${character.Slot}/bank.txt`)
    });

  return zip;
}

function createShareBanksDataFile(zip, shareBank, path)
{
  zip = createDataFile(zip, shareBank, `${path}/shareBank`);
  return zip;
}

function createAllItemsDataFile(zip, allItems, path)
{
  zip = createDataFile(zip, allItems, `${path}/allItems_no_slot`);
  zip = createDataFileWithSlot(zip, allItems, `${path}/allItems`)
  return zip;
}

function createSearchResultsDataFile(zip, searchResults, path)
{
  zip = createDataFile(zip, searchResults, `${path}/searchResults_no_slot`);
  zip = createDataFileWithSlot(zip, searchResults, `${path}/searchResults`)
  return zip;
}


function createDataFile(zip, data, path)
{
  if (data !== undefined & data !== 0) {
    let buffer  = data.map(item => item[1]["display"]).join("\r\n");
    zip.addFile(new TextEncoder().encode(buffer), {
      filename: new TextEncoder().encode(`${path}.txt`)
    });
  }
  return zip;
}

function createDataFileWithSlot(zip, data, path)
{
  let tmp = [];
  for (let item of data)
  {
    tmp.push(`${item[1]["display"]}, Slot: ${item[2]}`);
  }

  if (data !== undefined & data !== 0) {
    zip.addFile(new TextEncoder().encode(tmp.join("\r\n")), {
      filename: new TextEncoder().encode(`${path}.txt`)
    });
  }
  return zip;
}

function displayAfterEnterd()
{
    if (localStorage.getItem("fileData") === null) {
      document.getElementById("afterEnterd").style.opacity = 0;
      document.getElementById("afterEnterd").style.height = 0;
    } else {
      document.getElementById("afterEnterd").style.opacity = 1;
      document.getElementById("afterEnterd").style.height = "auto";
    }
}

function callAdterLoded(call)
{
  window.addEventListener('load', call());
}


function isClassicTheme()
{
  return localStorage.getItem("theme") === "classic";
}


function pushedPageColoer(id)
{
  isClassicTheme()
    ? document.getElementById(id).style.backgroundColor = "#fb7c03"
    : document.getElementById(id).style.backgroundColor = "#D2B48C";
}
