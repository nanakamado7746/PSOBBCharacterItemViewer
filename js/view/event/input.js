async function clickInput(event)
{
  try {

    const fileReader = new FileReader();
    const files = sortInputFiles(event.target.files);
    let fileData = [];

    for (const file of files)
    {
      //　キャラクターデータファイルだけ取り込み
      if (file.name.match(/psobank|psoclassicbank|psochar/) == null) continue;

      fileReader.readAsArrayBuffer(file);
      await new Promise(resolve => fileReader.onload = () => resolve());
      const binary = new Uint8Array(fileReader.result);

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
  if (this.characters.length !== 0)
  {
    // キャラクターデータがある場合、優先して表示
    displayCharacter(characters[0]);
    this.currentData["page"] = "character";
    this.currentData["searching"] = ["character", 0, this.characters[0]];
    pushedPageColoer(`pagecharacter${0}`);
  }
  else if (this.shareBanks.length !== 0)
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

    // 共有倉庫ファイルをデコード
    if (fileData[i]["filename"].match(/psoclassicbank/) !== null)
    {
      let classicBank = new ShareBank(binary, "Classic Bank");
      shareBanks.push(classicBank);
      allItems["EN"] = allItems["EN"].concat(classicBank.ShareBank["EN"]);
      allItems["JA"] = allItems["JA"].concat(classicBank.ShareBank["JA"]);
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
  allItems["EN"] = sortInventory(allItems["EN"]);
  allItems["JA"] = sortInventory(allItems["JA"]);

  // 言語変更時に取り出すためのインデックスを付与
  for (const [i, item] of allItems["EN"].entries()) {
    item.push(i);
  }
  for (const [i, item] of allItems["JA"].entries())
  {
    item.push(i);
  }

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
    // psobankは最後尾
    if (a.name.match(/psobank/)) return -1;

    // ファイル名のスロット番号を切り取って数値に変換する
    if (a.name.match(/\s\d+/) != null) a = parseInt(a.name.match(/[0-9]+(?=\.)/));
    if (b.name.match(/\s\d+/) != null) b = parseInt(b.name.match(/[0-9]+(?=\.)/));

    return a - b;
  });
  return sorted;
}
