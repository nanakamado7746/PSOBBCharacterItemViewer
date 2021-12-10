
// キャラクターデータ
var charactors = [];
var shareBanks = [];
var allItems = [];
var itemCodes = {};
var itemCodeInputDate;

//　初期表示
initializeItemCodes();
initializeDisplay();


function initializeItemCodes()
{
  try
  {
    if (localStorage.getItem("itemCodes"))
    {
      this.itemCodes = JSON.parse(localStorage.getItem("itemCodes"));
      console.log(this.itemCodes);
    }
    if (localStorage.getItem("itemCodeInputDate"))
    {
      this.itemCodeInputDate = JSON.parse(localStorage.getItem("itemCodeInputDate"));
      console.log(this.itemCodeInputDate);
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
    if (localStorage.getItem("charactors"))
    {
      this.charactors = JSON.parse(localStorage.getItem("charactors"));
      console.log(this.charactors);
    }
    if (localStorage.getItem("shareBanks"))
    {
      this.shareBanks = JSON.parse(localStorage.getItem("shareBanks"));
      console.log(this.shareBanks);
    }
    if (localStorage.getItem("allItems"))
    {
      this.allItems = JSON.parse(localStorage.getItem("allItems"));
      console.log(this.allItems);
    }
  }
  catch (e)
  {
    console.log(e);
    resetInnerHtml("charactorDetail");
    resetInnerHtml("pager");
    removeCharactorData();
    alert("Failed to display the charactor data");
  }
  finally
  {
    displayPager();
    displayCharactorDetail();
  }
}

function clickResetItemCodes(event)
{
  this.itemCodes = {};
  document.getElementById('inputItemCodesButton').value = '';
  localStorage.removeItem("itemCodes");
  localStorage.removeItem("itemCodeInputDate");
  displayInputItemCodesDetail();
}

function clickDisplayItemCodes(event)
{
  let itemCode;
  if (Object.keys(this.itemCodes).length === 0)
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
    let itemCodes = {};

    fileReader.readAsText(file);
    await new Promise(resolve => fileReader.onload = () => resolve());

    let list = fileReader.result.split(/\n/);
    itemCodes = getInputItemCodes(list);

    if (Object.keys(itemCodes).length === 0) throw new Error('no_item_code');

    let itemCodeInputDate = getDate();

    setItemCodes(itemCodes, itemCodeInputDate);
    displayInputItemCodesDetail(itemCodes, itemCodeInputDate);
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

function setItemCodes(itemCodes, itemCodeInputDate)
{
  this.itemCodes = itemCodes;
  localStorage.setItem("itemCodes", JSON.stringify(itemCodes));
  this.itemCodeInputDate = itemCodeInputDate;
  localStorage.setItem("itemCodeInputDate", JSON.stringify(itemCodeInputDate));
}

async function clickInputFile(event)
{

  let fileReader = new FileReader();
  let files = sortInputFiles(event.target.files);

  let itemCodes = this.itemCodes;
  let charactors = [];
  let shareBanks = [];
  let allItems = [];

  for (let i = 0; i < files.length; i++)
  {
    fileReader.readAsArrayBuffer(files[i]);
    await new Promise(resolve => fileReader.onload = () => resolve());
    let buffer = new Uint8Array(fileReader.result);

    // 共有倉庫ファイルをデコード
    if (files[i].name.match(/psobank/) != null)
    {
      let shareBank = new ShareBank(buffer, "Share Bank", itemCodes);
      shareBanks.push(shareBank);
      allItems = allItems.concat(shareBank.ShareBank);
      continue;
    }

    //　キャラクターファイルをデコード
    let slot = files[i].name.match(/\s\d+/)[0].trim();
    let charactor = new Charactor(buffer, slot, itemCodes);
    charactors.push(charactor);

    allItems = allItems.concat(charactor.Inventory);
    allItems = allItems.concat(charactor.Bank);
  }

  // ソート
  allItems = allItems.sort();
  // ローカルストレージ初期化
  removeCharactorData();
  // ローカルストレージにセット
  setCharactorData(charactors, shareBanks, allItems);
  // ページャーを表示
  displayPager();
  // 詳細表示
  displayCharactorDetail();
}

function removeCharactorData()
{
  localStorage.removeItem("charactors");
  localStorage.removeItem("shareBanks");
  localStorage.removeItem("allItems");
}

function setCharactorData(charactors, shareBanks, allItems)
{
  if (charactors.length !== 0)
  {
    this.charactors = charactors;
    localStorage.setItem("charactors", JSON.stringify(charactors));
    console.log(charactors);
  }

  if (shareBanks.length !== 0)
  {
    this.shareBanks = shareBanks;
    localStorage.setItem("shareBanks", JSON.stringify(shareBanks));
    console.log(shareBanks);
  }

  if (allItems.length !== 0)
  {
    this.allItems = allItems;
    localStorage.setItem("allItems", JSON.stringify(allItems));
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
