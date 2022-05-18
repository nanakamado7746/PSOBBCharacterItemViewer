
async function clickInput(event)
{
  try {

    const fileReader = new FileReader();
    const files = sortInputFiles(event.target.files);
    let fileData = [];

    for (const file of files)
    {
      //　キャラクターデータファイルだけ取り込み
      if (file.name.match(/psobank|psochar/) == null) continue;

      fileReader.readAsArrayBuffer(file);
      await new Promise(resolve => fileReader.onload = () => resolve());
      let binary = new Uint8Array(fileReader.result);

      fileData.push({
        "filename": file.name,
        "binary": binary
      });
    }

    // なかったら終わり
    if (fileData.length === 0) return;

    localStorage.setItem("fileData", JSON.stringify(fileData));

    // デコード
    decodeAndDisplay(fileData);

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

function decodeAndDisplay(fileData)
{
  decoder(fileData);
  displayPager();

  // 詳細表示
  if (characters.length !== 0)
  {
    // キャラクターデータがある場合、優先して表示
    displayCharacter(characters[0]);
    this.currentData["page"] = "character";
    this.currentData["searching"] = ["character", 0, this.characters[0]];
    pushedPageColoer(`pagecharacter${0}`);
  } else if (shareBanks.length !== 0)
  {
    // キャラクターデータがない場合は共有倉庫を表示
    displayShareBank(shareBanks[0]);
    this.currentData["page"] = "shareBank";
    this.currentData["searching"] = ["shareBank", 0, this.shareBanks[0]];
    pushedPageColoer(`pageshareBank${0}`);
  }

  // ファイル入力をきっかけにDOM表示
  displayAfterEnterd();
}

function decoder(fileData)
{
  if (fileData.length === 0) return;

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
      let character = new Character(binary, Number(slot) + 1);
      characters.push(character);

      allItems["EN"] = allItems["EN"].concat(character.Inventory["EN"]);
      allItems["EN"] = allItems["EN"].concat(character.Bank["EN"]);
      allItems["JA"] = allItems["JA"].concat(character.Inventory["JA"]);
      allItems["JA"] = allItems["JA"].concat(character.Bank["JA"]);
    }
  }

  // ソート
  allItems["EN"] = allItems["EN"].sort(function(a, b) {
    if (a[1]["type"] == "10" & b[1]["type"] == "10") return Number(b[0]) - Number(a[0]);
    if ( b > a) return -1;
    if ( a > b) return 1;
    return 0;
  });
  allItems["JA"] = allItems["JA"].sort(function(a, b) {
    if (a[1]["type"] == "10" & b[1]["type"] == "10") return Number(b[0]) - Number(a[0]);
    if ( b > a) return -1;
    if ( a > b) return 1;
    return 0;
  });

  // 言語変更時に取り出すためのインデックスを付与
  allItems["EN"].forEach(function(value, i){
    value.push(i);
  })
  allItems["JA"].forEach(function(value, i){
    value.push(i);
  })

  // グローバル変数初期化
  removeCharacterData();
  // グローバル変数とローカルストレージにセット
  setCharacterData(characters, shareBanks, allItems);
}


function setCharacterData(characters, shareBanks, allItems)
{
  if (characters.length !== 0)
  {
    this.characters = characters;
    console.log("===== characters =====");
    console.log(characters);
  }

  if (shareBanks.length !== 0)
  {
    this.shareBanks = shareBanks;
    console.log("===== shareBanks =====");
    console.log(shareBanks);
  }

  if (allItems.length !== 0)
  {
    this.allItems = allItems;
    console.log("===== allItems =====");
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
