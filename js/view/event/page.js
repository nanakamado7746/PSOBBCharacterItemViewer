function clickPage(catecory, index)
{

  const beforeScrollPosition = window.scrollY;
  const beforeStickyPosition = document.getElementById('sticky').getBoundingClientRect().top;
  for (const pageButton of document.getElementsByClassName("page"))
  {
    pageButton.style.backgroundColor = "";
    pageButton.style.color = "#000000";
  }
  pushedPageColoer(`page${catecory}${index}`);

  let id = document.getElementById("data");
  id.innerHTML = '';

  switch (catecory) {
    case "character":
      this.currentData["page"] = "character";
      this.currentData["searching"] = ["character", index, this.characters[index]];
      if (hasSearchItem()) { search(); break; }
      view(displayCharacter(this.characters[index]));
      break;
    case "shareBank":
      this.currentData["page"] = "shareBank";
      this.currentData["searching"] = ["shareBank", index, this.shareBanks[index]];
      if (hasSearchItem()) { search(); break; }
      view(displayInventory(this.shareBanks[index].Bank[this.lang], "SHARE BANK"));
      break;
    case "allItems":
      // 現在ページの情報を保存
      this.currentData["page"] = "allItems";
      this.currentData["searching"] = ["allItems", index, this.allItems[index]];
      if (hasSearchItem()) { search(); break; }
      view(displayInventory(this.allItems[index].Inventory[this.lang], "ALL ITEMS", "allItems"));
      break;
    default:
  }

  console.log("==== current page ====");
  console.log(this.currentData);

  scroll(beforeScrollPosition, beforeStickyPosition);
  setCursorAudio();
}

function resetPage()
{

  delete this.currentData["searchResults"];
  const beforeScrollPosition = window.scrollY;
  const beforeStickyPosition = document.getElementById('sticky').getBoundingClientRect().top;

  let id = document.getElementById("data");
  id.innerHTML = '';

  console.log("==== current page ====");
  console.log(this.currentData);

  if ( this.currentData["searching"][0] === "character") {
    this.currentData["page"] = "character";
    view(displayCharacter(this.currentData["searching"][2]));
  }
  if ( this.currentData["searching"][0] === "shareBank") {
    this.currentData["page"] = "shareBank";
    view(displayShareBank(this.currentData["searching"][2]));
  }
  if ( this.currentData["searching"][0] === "allItems") {
    this.currentData["page"] = "allItems";
    view(displayInventory(this.currentData["searching"][2].Inventory[this.lang], "ALL ITEMS", "allItems"));
  }

  scroll(beforeScrollPosition, beforeStickyPosition);
}

function scroll(beforeScrollPosition, beforeStickyPosition)
{
  if (document.getElementById('sticky').getBoundingClientRect().top > 0 | beforeStickyPosition > 0)
  {
    scrollTo(0, document.getElementById('sticky').getBoundingClientRect().top);
    scrollTo(0, beforeScrollPosition);
  }
  else if (document.getElementById('sticky').getBoundingClientRect().top === 0)
  {
    scrollTo(0, document.getElementById('sticky').getBoundingClientRect().top);
    document.getElementById('sticky').scrollIntoView();
  }
}
