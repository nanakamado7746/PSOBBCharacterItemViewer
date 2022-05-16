function clickDownload()
{
  if (localStorage.getItem("fileData") === null) return;

  let zip = new Zlib.Zip();

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
  if (this.currentData !== undefined) zip = createCurrentPageDataFile(zip, this.currentData);

  const compressed = zip.compress();
  const blob = new Blob([compressed], { 'type': 'application/zip' });

  const link = document.createElement('a');
  link.setAttribute('download', "psobb_character_data.zip");
  link.setAttribute('href', window.webkitURL.createObjectURL(blob));
  link.click();
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
  return createDataFile(zip, shareBank, `${path}/shareBank`);
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
