// 入力データ
var fileData = [];
var itemCodeData = [];
var lang = "EN";
// デコード済みデータ
var characters = [];
var shareBanks = [];
var allItems = [];
var searchResults = [];

// 初期表示
initializeLang();
initializeDisplay();
displayNotification();
initializeTheme();
initializeVolume();

// DOM取得後の初期表示
window.addEventListener('load', function(){

  dynamicSearch();
  displayAfterEnterd()
});

function initializeVolume()
{
  // firefox用
  document.getElementById("volume_range").value = 0;
}

function initializeTheme()
{
  if (localStorage.getItem("theme"))
  {
    this.theme = JSON.parse(localStorage.getItem("theme"));
    console.log("theme:" + this.theme);
    document.getElementById("stylesheet").href = `./css/${this.theme}.css`;
  }
  if (this.theme !== "classic") {
    document.getElementsByName("themes")[1].checked = true;
  }
}


function initializeLang()
{
  if (localStorage.getItem("lang"))
  {
    this.lang = JSON.parse(localStorage.getItem("lang"));
    console.log("lang:" + this.lang);
  } else {
    localStorage.setItem("lang", JSON.stringify("EN"));
  }
  if (this.lang == "JA") {
    document.getElementsByName("lang")[1].checked = true;
  }
}

// ローカルストレージが存在していた場合、画面に表示する
function initializeDisplay()
{

  try
  {
    if (localStorage.getItem("fileData"))
    {
      this.fileData = JSON.parse(localStorage.getItem("fileData"));
      console.log(JSON.parse(localStorage.getItem("fileData")));
      decoder();
    }
    displayPager();
    displayData();
  }
  catch (e)
  {
    alert("error occurred. please super reload (F5)");
    console.log(e);
    document.getElementById("data").innerHTML = '';
    document.getElementById("pager").innerHTML = '';
    removeCharactorData();
    localStorage.removeItem("fileData");
  }
}

function changeLang()
{

  let lang;
  (document.getElementsByName("lang")[1].checked)
    ? lang = "JA"
    : lang = "EN";

  if (lang === this.lang) return;
  this.lang = lang;

  playSoundOpen();

  localStorage.setItem("lang", JSON.stringify(this.lang));
  console.log(this.lang);

  dynamicSearch("changeLang");

  // 言語変更でDOMを変更
  if (localStorage.getItem("currentpage"))
  {
    let currentpage = JSON.parse(localStorage.getItem("currentpage"));
    console.log("currentpage:" + currentpage);

    let id = document.getElementById("data");
    id.innerHTML = '';

    if (currentpage[0] === "itemcode") displayItemCodes();
    if (currentpage[0] === "shareBanks") displayInventory(currentpage[1].ShareBank[this.lang], "SHARE BANK");
    if (currentpage[0] === "allItems") displayInventory(this.allItems[this.lang], "ALL ITEMS", "allItems");
    if (currentpage[0] === "searchResults") {
      let tmp = [];
      currentpage[1].forEach((value) => {
        this.allItems[lang].forEach((value2) => {
          if (value[3] === value2[3]) tmp.push(value2);
        });
      });
      // 現在ページの情報を保存
      this.searchResults = tmp;
      localStorage.setItem("currentpage", JSON.stringify(["searchResults", tmp]));
      displayInventory(tmp, "SEARCH RESULTS", "allItems");
    }
    if (currentpage[0] === "character") displayCharactor(currentpage[1]);
  }
}


function clickDisplayItemCodes(event)
{
  playSoundOpen();
  localStorage.setItem("currentpage", JSON.stringify(["itemcode", ""]));
  displayItemCodes();
}

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

async function clickInput(event)
{
  try {

    let fileReader = new FileReader();
    let files = sortInputFiles(event.target.files);
    let fileData = [];

    for (let i = 0; i < files.length; i++)
    {
      //　キャラクターデータファイルだけ取り込み
      if (files[i].name.match(/psobank|psochar/) == null) continue;

      fileReader.readAsArrayBuffer(files[i]);
      await new Promise(resolve => fileReader.onload = () => resolve());
      let binary = new Uint8Array(fileReader.result);

      fileData.push({
        "filename": files[i].name,
        "binary": binary
      });
    }

    // なかったら終わり
    if (fileData.length === 0) return;

    localStorage.setItem("fileData", JSON.stringify(fileData));
    this.fileData = fileData;

    displayAfterEnterd();

    // デコード
    decoder();
    // ページャーを表示
    displayPager();
    // 詳細表示
    displayData();
    // 入力リアルタイム検索機能ロード
    dynamicSearch();

  } catch(e) {
    //例外エラーが起きた時に実行する処理
    console.log(e);
    if (e.name === 'QuotaExceededError')
    {
      alert("File size has exceeded local storage capacity. Try to Reduce input file number or Browser settings.\n"
          + "ファイルサイズがローカルストレージの容量を超えました。 入力するファイル数を減らすか、ブラウザの設定を行ってください。");
    } else {
      alert(e);
    }
  } finally {
  }
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

function clickCharactor(name)
{
  playSoundOpen();
  // 現在ページの情報を保存
  localStorage.setItem("currentpage", JSON.stringify(["character", this.characters[name]]));
  displayCharactor(this.characters[name]);
}

function clickShareBank(name)
{
  playSoundOpen();
  // 現在ページの情報を保存
  localStorage.setItem("currentpage", JSON.stringify(["shareBanks", this.shareBanks[name]]));
  let id = document.getElementById("data");
  id.innerHTML = '';
  displayInventory(this.shareBanks[name].ShareBank[this.lang], "SHARE BANK")
}

function clickAllItems(name)
{
  playSoundOpen();
  // 現在ページの情報を保存
  localStorage.setItem("currentpage", JSON.stringify(["allItems", this.allItems]));
  let id = document.getElementById("data");
  id.innerHTML = '';
  displayInventory(this.allItems[this.lang], "ALL ITEMS", "allItems")
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

// 検索ボタンイベント
function clickSearch(event)
{

  search(
    this.allItems,
    this.lang);

}

// 入力イベントの随時検索
function dynamicSearch(call)
{

  let allitems = this.allItems;
  let lang = this.lang;
  // イベントリスナーでイベント「input」を登録
  document.getElementById("ｃategorysearch").addEventListener("input",function(){
    if (call !== "changeLang") playSoundOpen();
    search(allItems, lang);
  });

  document.getElementById("wordsearch").addEventListener("input",function(){
    // if (call !== "changeLang") playSoundCursor();
    search(allItems, lang);
  });
}

function search(allItems, lang)
{

  let word = document.getElementsByName("word")[0].value;
  let element = document.getElementsByName("element")[0].value;
  let hit = document.getElementsByName("hit")[0].value;
  let unTekked = document.getElementsByName("unTekked")[0].checked;
  let types = document.getElementsByName("types");

  console.log("==== search all items ====");
  console.log(allItems);
  console.log("search word:" + word);
  console.log("search element:" + element);
  console.log("search hit:" + hit);
  console.log("search unTekked:" + unTekked);
  types.forEach((item) => {
    console.log(`search types: ${item.value} ${item.checked}`);
  });


  let id = document.getElementById("data");
  id.innerHTML = '';

  // リストがない場合は終了
  if (this.allItems.length === 0) return;

  // 検索結果初期値。検索欄未入力で全アイテムを表示する
  let result = [];

  // 検索ワードの全角を半角に変換
  // 検索ワードのひらがなをかたかなに変換
  // 検索ワードを大文字化、トリム
  word = word
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    .replace(/[ぁ-ん]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0x60);
    })
    .toUpperCase().trim();

  element = element
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    .replace(/[ぁ-ん]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0x60);
    })
    .toUpperCase().trim();

  // 検索Hit値の全角を半角に変換
  hit = hit.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });

  console.log("search word converted:" + word);
  console.log("search hit converted:" + hit);

  // typeの選択状態を表す
  let typeSelected = false;
  for (const value of types)
  {
    if (value.checked)
    {
      // typeが選択されていると、選択状態をtrueにする
      typeSelected = true;
      result = result.concat(allItems[lang].filter(function(x)
        {
            return (x[1].type == value.value);
        }
      ));
    }
  }

  // typesがすべてfalse（未選択）だった場合、すべてのアイテムを対象にする。
  if (!typeSelected) result = allItems[lang];


  // 名前が指定された場合
  if (word !== "")
  {
    result = result.filter(function(x)
      {

        // 検索対象の全角を半角に変換
        // 検索対象のひらがなをかたかなに変換
        // 検索対象を大文字化、トリム
        let target = x[1].name
          .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
          })
          .replace(/[ぁ-ん]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) + 0x60);
          })
          .toUpperCase();

        return target.match(word);
      }
    );
  }

  // エレメントが指定された場合
  if (element !== "")
  {
    result = result.filter(function(x)
      {
        if (x[1].type === 1 | x[1].type === 8)
        {
          // 武器かS武器の場合、検索対象のエレメント名をカタカナ、大文字へ変換
          target = x[1].element
            .replace(/[ぁ-ん]/g, function(s) {
              return String.fromCharCode(s.charCodeAt(0) + 0x60);
            })
            .toUpperCase();

          return target.match(element);
        }
      }
    );
  }

  if (unTekked)
  {
    result = result.filter(function(x)
      {
        if (x[1].type === 1) return x[1].tekked === false;
      }
    );
  }

  // HIT値
  if (hit !== "" & !isNaN(hit))
  {
    result = result.filter(function(x)
      {
        if (x[1].type === 1) return x[1].attribute["hit"] >= hit;
      }
    );
  }

  console.log("==== search results ====");
  console.log(result);

  this.searchResults = result;

  // 現在ページの情報を保存
  localStorage.setItem("currentpage", JSON.stringify(["searchResults", this.searchResults]));

  displayInventory(result, "SEARCH RESULTS", "allItems")
}

function clickChangeTheme(value)
{
  refreshVolume();
  document.getElementById("stylesheet").href = `./css/${value}.css`;
  console.log("change to:" + value);
  localStorage.setItem("theme", JSON.stringify(value));
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

  let els = document.getElementsByClassName("data_body");
  for (let el of els)
  {
    el.onmouseover = function() {
      if (value > 0) {
        playSoundCursor(value);
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

function refreshOpenSound()
{
  (document.getElementsByName("themes")[0].checked)
   ? setVolume(document.getElementById("volume_range").value)
   : setVolume(0);
}

function isClassicTheme()
{
  return document.getElementsByName("themes")[0].checked;
}

function playSoundOpen()
{
  if (isClassicTheme()) {
    let sound = new Audio("./resources/sounds/se/open.wav");
    sound.volume = document.getElementById("volume_range").value;
    sound.play();
  }
}

function playSoundCancel()
{
  if (isClassicTheme()) {
    let sound = new Audio("./resources/sounds/se/cancel.wav");
    sound.volume = document.getElementById("volume_range").value;
    sound.play();
  }
}

function playSoundCursor(value)
{
  if (isClassicTheme()) {
    let sound = new Audio("./resources/sounds/se/cursor.wav");
    sound.volume = value;
    sound.play();
  }
}

function playSoundEnter()
{
  if (isClassicTheme()) {
    let sound = new Audio("./resources/sounds/se/enter.wav");
    sound.volume = document.getElementById("volume_range").value;
    sound.play();
  }
}

function download()
{

  if (localStorage.getItem("fileData") === null) return;

  var zip = new Zlib.Zip();

  // キャラクターデータファイル作成
  for (let character of this.characters)
  {
    zip = createCharacterDataFile(zip, character, `psobb_character_data/alldata`);
  }
  // ShareBankデータファイル作成
  zip = createShareBanksDataFile(zip, this.shareBanks[0]["ShareBank"][this.lang], `psobb_character_data/alldata`);
  // AllItemsデータファイル作成
  zip = createAllItemsDataFile(zip, this.allItems[this.lang], `psobb_character_data/alldata`);

  // 現在ページのデータファイルを作成
  if (localStorage.getItem("currentpage"))
  {
    zip = createCurrentPageDataFile(zip, JSON.parse(localStorage.getItem("currentpage")));
  }

  let compressed = zip.compress();
  let blob = new Blob([compressed], { 'type': 'application/zip' });

  let link = document.createElement('a');
  link.setAttribute('download', "psobb_character_data.zip");
  link.setAttribute('href', window.webkitURL.createObjectURL(blob));
  link.click();

}

function createCurrentPageDataFile(zip, currentpage)
{
  if (currentpage[0] === "character") return createCharacterDataFile(zip, currentpage[1], "psobb_character_data");
  if (currentpage[0] === "shareBanks") return createShareBanksDataFile(zip, currentpage[1]["ShareBank"][this.lang], "psobb_character_data");
  if (currentpage[0] === "allItems") return createAllItemsDataFile(zip, currentpage[1][this.lang], "psobb_character_data");
  if (currentpage[0] === "searchResults") return createSearchResultsDataFile(zip, currentpage[1], "psobb_character_data");
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
      filename: new TextEncoder().encode(`${folder}/${character.Slot}_${character.Name}/character.txt`)
    });

    let inventory = character["Inventory"][this.lang].map(item => item[1]["display"]).join("\r\n");
    zip.addFile(new TextEncoder().encode(inventory), {
      filename: new TextEncoder().encode(`${folder}/${character.Slot}_${character.Name}/inventory.txt`)
    });

    let bank = character["Bank"][this.lang].map(item => item[1]["display"]).join("\r\n");
    zip.addFile(new TextEncoder().encode(bank), {
      filename: new TextEncoder().encode(`${folder}/${character.Slot}_${character.Name}/bank.txt`)
    });

  return zip;
}

function createShareBanksDataFile(zip, shareBank, path)
{
  zip = createDataFile(zip, shareBank, `${path}/shareBanks`);
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
    (localStorage.getItem("fileData") === null)
      ? document.getElementById("afterEnterd").style.opacity = 0
      : document.getElementById("afterEnterd").style.opacity = 1;
}
