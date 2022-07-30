function clickChangeLang(lang)
{
  if (lang === this.lang) return;

  this.lang = lang;

  localStorage.setItem("lang", lang);
  console.log("changelang to:" + lang);

  intializeElementsList(document.getElementById("elements").selectedIndex);

  // 言語変更でDOMを変更
  if (this.currentData.length !== 0)
  {
    let id = document.getElementById("data");
    id.innerHTML = '';
    if (this.currentData["page"] === "itemcode") displayItemCodes();
    if (this.currentData["page"] === "character") displayCharacter(this.currentData["searching"][2]);
    if (this.currentData["page"] === "shareBank") displayShareBank(this.currentData["searching"][2]);
    if (this.currentData["page"] === "allItems") displayInventory(this.currentData["searching"][2].Inventory[this.lang], "ALL ITEMS", "allItems");
    if (this.currentData["page"] === "searchResults")
    {
      let tmp = [];
      // 言語変更後の全アイテムから、現在検索されているアイテムを取り出す
      for (const i of this.currentData["searchResults"])
      {
        // 検索中データのモードの全アイテムからイテレーターを抽出
        for (const j of this.allItems[this.currentData["searching"][2].Mode].Inventory[lang])
        {
          // 全てのアイテムに付与されている固有のインデックス番号を比較して同じなら取り出す
          if (i[3] === j[3]) tmp.push(j);
        }
      }
      // 現在ページの情報を保存
      this.currentData["page"] = "searchResults";
      this.currentData["searchResults"] = tmp;
      displayInventory(tmp, "SEARCH RESULTS", "allItems");
    }
  }

  playAudio(this.open_audios);
}
