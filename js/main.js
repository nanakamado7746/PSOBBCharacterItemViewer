// 入力データ
var fileData = [];
var itemCodeData = [];
var jmode = false;
// デコード済みデータ
var charactors = [];
var shareBanks = [];
var allItems = [];

// 初期表示
initializeLang();
initializeDisplay();

function initializeLang()
{
  if (localStorage.getItem("jmode"))
  {
    this.jmode = JSON.parse(localStorage.getItem("jmode"));
    console.log("jmode:" + this.jmode);
  }
  if (this.jmode) {
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
  let jmode = document.getElementsByName("lang")[1].checked;
  localStorage.setItem("jmode", JSON.stringify(jmode));
  this.jmode = jmode;
  console.log(this.jmode);
}


function clickDisplayItemCodes(event)
{
  displayItemCodes();
}

function decoder()
{
  if (this.fileData.length === 0) return;

  let fileData = this.fileData;
  let charactors = [];
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
      let slot = fileData[i]["filename"].match(/\s\d+/)[0].trim();
      let charactor = new Charactor(binary, Number(slot) + 1);
      charactors.push(charactor);

      allItems["EN"] = allItems["EN"].concat(charactor.Inventory["EN"]);
      allItems["EN"] = allItems["EN"].concat(charactor.Bank["EN"]);
      allItems["JA"] = allItems["JA"].concat(charactor.Inventory["JA"]);
      allItems["JA"] = allItems["JA"].concat(charactor.Bank["JA"]);
    }
  }

  // ソート
  allItems["EN"] = allItems["EN"].sort();
  allItems["JA"] = allItems["JA"].sort();

  console.log(allItems);
  // グローバル変数初期化
  removeCharactorData();
  // グローバル変数とローカルストレージにセット
  setCharactorData(charactors, shareBanks, allItems);
}

async function clickInput(event)
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
  displayData();
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
