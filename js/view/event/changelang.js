function clickChangeLang(lang)
{
  if (lang === this.lang) return;

  this.lang = lang;

  localStorage.setItem("lang", lang);
  console.log("changelang to:" + lang);

  // 言語変更でDOMを変更
  if (this.currentData.length !== 0)
  {
    let id = document.getElementById("data");
    id.innerHTML = '';

    if (this.currentData["page"] === "itemcode") displayItemCodes();
    if (this.currentData["page"] === "character") displayCharacter(this.currentData["searching"][2]);
    if (this.currentData["page"] === "shareBank") displayShareBank(this.currentData["searching"][2]);
    if (this.currentData["page"] === "allItems") displayInventory(this.currentData["searching"][2][this.lang], "ALL ITEMS", "allItems");
    if (this.currentData["page"] === "searchResults")
    {
      // 検索結果のアイテムに付与されているインデックス番号と同じアイテムを切り替え言語の全アイテムから取り出す。
      for (const i of this.currentData["searchResults"])
      {
        for (const j of this.allItems[lang])
        {
          if (i[3] === j[3]) tmp.push(j);
        }
      }
      // 現在ページの情報を保存
      this.searchResults = tmp;
      this.currentData["page"] = "searchResults";
      this.currentData["searchResults"] = tmp;
      displayInventory(tmp, "SEARCH RESULTS", "allItems");
    }
  }

  playAudio(this.open_audios);
}
