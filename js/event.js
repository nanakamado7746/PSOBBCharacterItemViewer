
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

    setCursorAudio();
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

function clickDisplayItemCodes(event)
{
  playAudio(this.open_audios);
  displayItemCodes();
  setCursorAudio();
  this.currentData["page"] = "itemcode";
}

function clickPage(catecory, index)
{

  let beforeScrollY  = window.scrollY;
  for (let page of document.getElementsByClassName("page")) page.style.backgroundColor = "";

  pushedPageColoer(`page${catecory}${index}`);

  let id = document.getElementById("data");


  console.log(this.currentData);
  switch (catecory) {
    case "character":
      this.currentData["page"] = "character";
      this.currentData["searching"] = ["character", index, this.characters[index]];
      if (hasSearchItem())
      {
        search();
        break;
      }
      id.innerHTML = '';
      displayCharacter(this.characters[index]);
      break;
    case "shareBank":
      this.currentData["page"] = "shareBank";
      this.currentData["searching"] = ["shareBank", index, this.shareBanks[index]];
      if (hasSearchItem())
      {
        search();
        break;
      }
      id.innerHTML = '';
      displayInventory(this.shareBanks[index].ShareBank[this.lang], "SHARE BANK");
      break;
    case "allItems":
      // 現在ページの情報を保存
      this.currentData["page"] = "allItems";
      this.currentData["searching"] = ["allItems", index, this.allItems];
      if (hasSearchItem())
      {
        search();
        break;
      }
      id.innerHTML = '';
      displayInventory(this.allItems[this.lang], "ALL ITEMS", "allItems");
      break;
    default:
  }

  if (document.getElementById('sticky').getBoundingClientRect().top > 0)
  {
    scrollTo(0, document.getElementById('data_window').getBoundingClientRect().top);
    scrollTo(0, beforeScrollY);
  }
  else if (document.getElementById('sticky').getBoundingClientRect().top === 0)
  {
    scrollTo(0, document.getElementById('data_window').getBoundingClientRect().top);
    document.getElementById('sticky').scrollIntoView();
  }

  playAudio(this.open_audios);
  setCursorAudio();
}

window.addEventListener('load', dynamicSearch, false);

function dynamicSearch()
{
  document.getElementById("wordsearch").addEventListener("keyup",function(){
    console.log(localStorage.getItem("lang"));
    search(data, lang);
  }, false);
}


function changeLang()
{

  let lang;
  (document.getElementsByName("lang")[1].checked)
    ? lang = "JA"
    : lang = "EN";

  if (lang === this.lang) return;
  this.lang = lang;

  playAudio(this.open_audios);

  localStorage.setItem("lang", JSON.stringify(this.lang));
  console.log(this.lang);

  console.log(this.currentData);
  // 言語変更でDOMを変更
  if (this.currentData.length !== 0)
  {
    let id = document.getElementById("data");
    id.innerHTML = '';

    console.log(this.currentData);
    if (this.currentData["page"] === "itemcode") displayItemCodes();
    if (this.currentData["page"] === "character") displayCharacter(this.currentData["searching"][2]);
    if (this.currentData["page"] === "shareBank") displayShareBank(this.currentData["searching"][2]);
    if (this.currentData["page"] === "allItems") displayInventory(this.currentData["searching"][2][this.lang], "ALL ITEMS", "allItems");
    if (this.currentData["page"] === "searchResults") {
      let tmp = [];
      this.currentData["searchResults"].forEach((value) => {
        this.allItems[lang].forEach((value2) => {
          if (value[3] === value2[3]) tmp.push(value2);
        });
      });
      // 現在ページの情報を保存
      this.searchResults = tmp;
      displayInventory(tmp, "SEARCH RESULTS", "allItems");
      this.currentData["page"] = "searchResults";
      this.currentData["searchResults"] = tmp;
    }
  }
  setCursorAudio();

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
  if (this.shareBanks !== null & this.shareBanks.length !== 0)
  {
    zip = createShareBanksDataFile(zip, this.shareBanks[0]["ShareBank"][this.lang], `psobb_character_data/alldata`);
  }
  // AllItemsデータファイル作成
  zip = createAllItemsDataFile(zip, this.allItems[this.lang], `psobb_character_data/alldata`);

  // 現在ページのデータファイルを作成
  console.log(this.currentData);
  if (this.currentData !== undefined)
  {
    zip = createCurrentPageDataFile(zip, this.currentData);
  }

  let compressed = zip.compress();
  let blob = new Blob([compressed], { 'type': 'application/zip' });

  let link = document.createElement('a');
  link.setAttribute('download', "psobb_character_data.zip");
  link.setAttribute('href', window.webkitURL.createObjectURL(blob));
  link.click();

}

function clickSearch(call)
{
  search();
}

function clickReset()
{
  resetSearchItems();
  resetPage();
  playAudioOpen();
}

function clickChangeTheme(value)
{
  refreshVolume();
  document.getElementById("stylesheet").href = `./css/${value}.css`;
  console.log("change to:" + value);
  localStorage.setItem("theme", value);
  console.log(this.currentData);
  pushedPageColoer(`page${this.currentData["searching"][0]}${this.currentData["searching"][1]}`);
}

function resetPage()
{

  delete this.currentData["searchResults"];
  let beforeScrollY = window.scrollY;

  let id = document.getElementById("data");
  id.innerHTML = '';

  console.log(this.currentData);
  if ( this.currentData["searching"][0] === "character") {
    this.currentData["page"] = "character";
    displayCharacter(this.currentData["searching"][2]);
  }
  if ( this.currentData["searching"][0] === "shareBank") {
    this.currentData["page"] = "shareBank";
    displayShareBank(this.currentData["searching"][2]);
  }
  if ( this.currentData["searching"][0] === "allItems") {
    this.currentData["page"] = "allItems";
    displayInventory(this.currentData["searching"][2][this.lang], "ALL ITEMS", "allItems");
  }

  if (document.getElementById('sticky').getBoundingClientRect().top > 0 | beforeScrollY !== window.scrollY)
  {
    scrollTo(0, document.getElementById('data_window').getBoundingClientRect().top);
    scrollTo(0, beforeScrollY);
  }
  else if (document.getElementById('sticky').getBoundingClientRect().top === 0)
  {
    scrollTo(0, document.getElementById('data_window').getBoundingClientRect().top);
    document.getElementById('sticky').scrollIntoView();
  }
  setCursorAudio();
}
