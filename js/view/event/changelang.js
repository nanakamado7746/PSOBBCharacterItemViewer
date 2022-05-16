function clickChangeLang(lang)
{
  if (lang === this.lang) return;

  this.lang = lang;

  localStorage.setItem("lang", JSON.stringify(lang));
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

  playAudio(this.open_audios);
}
