// 入力データ
var fileData = [];
var itemCodeData = [];
// デコード済みデータ
var charactors = [];
var shareBanks = [];
var allItems = [];

// 初期表示
initializeItemCodes();
initializeDisplay();

function initializeItemCodes()
{
  try
  {
    if (localStorage.getItem("itemCodeData"))
    {
      this.itemCodeData = JSON.parse(localStorage.getItem("itemCodeData"));
      console.log(this.itemCodeData);
    }
  }
  catch (e)
  {
    console.log(e);
    localStorage.removeItem("itemCodes");
    alert("Failed to display the item code");
  }
  finally
  {
    displayInputItemCodesDetail();
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
    displayCharactorDetail();
  }
  catch (e)
  {
    console.log(e);
    resetInnerHtml("data");
    resetInnerHtml("pager");
    removeCharactorData();
    alert("Failed to display the charactor data");
  }
}

function clickResetItemCodes(event)
{
  this.itemCodeData = [];
  document.getElementById('inputItemCodesButton').value = '';
  localStorage.removeItem("itemCodeData");
  displayInputItemCodesDetail();
}

function clickDisplayItemCodes(event)
{
  let itemCode = this.itemCodeData;
  if (typeof itemCode["itemCodes"] === "undefined")
  {
    let config = new Config();
    itemCodes = config.ItemCodes;
  }
  displayItemCodes();
}

async function clickInputItemCodes(event)
{
  try {

    let fileReader = new FileReader();
    let file = event.target.files[0];

    if ( file.name.match(/^items_list.lua$/) == null) throw new Error('not_match_filename');

    // アイテムコード初期化
    let itemCodeData = {};

    fileReader.readAsText(file);
    await new Promise(resolve => fileReader.onload = () => resolve());

    let list = fileReader.result.split(/\n/);
    itemCodeData["itemCodes"] = getInputItemCodes(list);

    if (Object.keys(itemCodeData).length === 0) throw new Error('no_item_code');

    itemCodeData["date"] = getDate();

    setItemCodes(itemCodeData);
    displayInputItemCodesDetail();
  }
  catch (e)
  {
    console.log(e);
    if (e.message == "not_match_filename")
    {
      alert("Please input 'items_list.lua'");
    }
    else
    {
      alert("Failed to read the file.");
    }
  }
}

function decoder()
{
  if (this.fileData.length === 0) return;
  let fileData = this.fileData;
  let itemCodes = this.itemCodeData["itemCodes"];
  let charactors = [];
  let shareBanks = [];
  let allItems = [];

  for (let i in fileData)
  {
    let binary = Object.values(fileData[i]["binary"]);

    // 共有倉庫ファイルをデコード
    if (fileData[i]["filename"].match(/psobank/) !== null)
    {
      let shareBank = new ShareBank(binary, "Share Bank", itemCodes);
      shareBanks.push(shareBank);
      allItems = allItems.concat(shareBank.ShareBank);
      continue;
    }

    //　キャラクターファイルをデコード
    if (fileData[i]["filename"].match(/psochar/) !== null)
    {
      let slot = fileData[i]["filename"].match(/\s\d+/)[0].trim();
      let charactor = new Charactor(binary, slot, itemCodes);
      charactors.push(charactor);

      allItems = allItems.concat(charactor.Inventory);
      allItems = allItems.concat(charactor.Bank);
    }
  }
  // ソート
  allItems = allItems.sort();

  // グローバル変数初期化
  removeCharactorData();
  // グローバル変数とローカルストレージにセット
  setCharactorData(charactors, shareBanks, allItems);
}

async function clickInputFile(event)
{

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

  // デコード
  decoder();
  // ページャーを表示
  displayPager();
  // 詳細表示
  displayCharactorDetail();
}

function setCharactorData(charactors, shareBanks, allItems)
{
  if (charactors.length !== 0)
  {
    this.charactors = charactors;
    console.log(charactors);
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
  displayCharactor(this.charactors[name]);
}

function clickShareBank(name)
{
  let id = document.getElementById("data");
  id.innerHTML = '';
  displayInventory(id, this.shareBanks[name].ShareBank, "SHARE BANK")
}

function clickAllItems(name)
{
  let id = document.getElementById("data");
  id.innerHTML = '';

  displayInventory(id, this.allItems, "ALL ITEMS", "allItems")
}

// FileListをファイル名の照準にする
function sortInputFiles(files)
{
  let sorted = [].slice.call(files).sort(function(a, b) {
    if (a.name.match(/psobank/)) return -1;

    // ファイル名のスロット番号を切り取って数値に変換する
    if (a.name.match(/\s\d+/) != null) {
      a = parseInt(a.name.match(/\s\d+/)[0].trim());
    }
    if (b.name.match(/\s\d+/) != null){
      b = parseInt(b.name.match(/\s\d+/)[0].trim());
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
  this.charactors = [];
  this.shareBanks = [];
  this.allItems = [];
}
