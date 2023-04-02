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

  displayInventory(this.allItems[0].Inventory[this.lang], "ALL ITEMS", "allItems");
  this.currentData["page"] = "allItems";
  this.currentData["searching"] = ["allItems", 0, this.allItems[0]];
  pushedPageColoer(`pageallItems${0}`);

  // ファイル入力をきっかけにDOM表示
  displayAfterEnterd();
}

function decoder(fileData)
{
  if (fileData.length === 0) return;

  let characters = [];
  let shareBanks = [];
  // allItemsのオブジェクト作成
  let allItems = [
      {
        Slot : "AllItems",
        Mode : Config.Mode.NORMAL,
        Inventory : {
          "JA" : [],
          "EN" : []
        }
      },
      {
        Slot : "AllItems:Classic",
        Mode : Config.Mode.CLASSIC,
        Inventory : {
          "JA" : [],
          "EN" : []
        }
      },
    ];


  for (let i in fileData)
  {
    let binary = Object.values(fileData[i]["binary"]);

    // 共有倉庫ファイルをデコード
    if (fileData[i]["filename"].match(/psobank/) !== null)
    {
      const shareBank = new ShareBank(binary, Config.Mode.NORMAL);
      shareBanks.push(shareBank);
      allItems[shareBank.Mode].Inventory["EN"] = allItems[shareBank.Mode].Inventory["EN"].concat(shareBank.Bank["EN"]);
      allItems[shareBank.Mode].Inventory["JA"] = allItems[shareBank.Mode].Inventory["JA"].concat(shareBank.Bank["JA"]);
      continue;
    }

    // 共有倉庫ファイルをデコード
    if (fileData[i]["filename"].match(/psoclassicbank/) !== null)
    {
      const classicBank = new ShareBank(binary, Config.Mode.CLASSIC);
      shareBanks.push(classicBank);
      allItems[classicBank.Mode].Inventory["EN"] = allItems[classicBank.Mode].Inventory["EN"].concat(classicBank.Bank["EN"]);
      allItems[classicBank.Mode].Inventory["JA"] = allItems[classicBank.Mode].Inventory["JA"].concat(classicBank.Bank["JA"]);
      continue;
    }

    //　キャラクターファイルをデコード
    if (fileData[i]["filename"].match(/psochar/) !== null)
    {
      const slot = fileData[i]["filename"].match(/[0-9]+(?=\.)/);
      const character = new Character(binary, Number(slot) + 1);
      characters.push(character);

      allItems[character.Mode].Inventory["EN"] = allItems[character.Mode].Inventory["EN"].concat(character.Inventory["EN"])
                                                                                         .concat(character.Bank["EN"]);
      allItems[character.Mode].Inventory["JA"] = allItems[character.Mode].Inventory["JA"].concat(character.Inventory["JA"])
                                                                                         .concat(character.Bank["JA"]);
    }
  }

  // ソート
  for (const i in allItems)
  {
    allItems[i].Inventory["EN"] = sortInventory(allItems[i].Inventory["EN"]);
    allItems[i].Inventory["JA"] = sortInventory(allItems[i].Inventory["JA"]);

    // 言語変更時に検索中のアイテムを取り出すためのインデックスを付与
    for (const [j, item] of allItems[i].Inventory["EN"].entries())
    {
      item.push(j);
    }
    for (const [j, item] of allItems[i].Inventory["JA"].entries())
    {
      item.push(j);
    }
  }

  // グローバル変数初期化
  removeGlobalVariable();
  // グローバル変数にデータをセット
  setGlobalVariable(characters, shareBanks, allItems);
}

function setGlobalVariable(characters, shareBanks, allItems)
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

  setModeData("characters", characters);
  setModeData("shareBanks", shareBanks);
  setModeData("allItems", allItems);
  console.log("===== normal data =====");
  console.log(this.normals);
  console.log("===== classics data =====");
  console.log(this.classics);
}

function setModeData(type, models)
{
  let normals = [];
  let classics = [];
  for (const model of models)
  {
    (model.Mode == Config.Mode.NORMAL)
      ? normals.push(model)
      : classics.push(model)
  }

  this.normals[type] = [normals];
  this.classics[type] = [classics];
}

// FileListをファイル名の照準にする
function sortInputFiles(files)
{
  let sorted = [].slice.call(files).sort(function(a, b) {

    console.log("sorted:" + " a:" + a.name + " b:" + b.name);

    // psoclassicbankは最後尾
    if (a.name.match(/psobank/) && b.name.match(/psoclassicbank/)) return -1;
    if (b.name.match(/psobank/) && a.name.match(/psoclassicbank/)) return 1;
    // psobankは最後尾
    if (a.name.match(/psobank/)) return 1;

    // ファイル名のスロット番号を切り取って数値に変換する
    if (a.name.match(/\s\d+/) != null) a = parseInt(a.name.match(/[0-9]+(?=\.)/));
    if (b.name.match(/\s\d+/) != null) b = parseInt(b.name.match(/[0-9]+(?=\.)/));

    return a - b;
  });

  return sorted;
}
