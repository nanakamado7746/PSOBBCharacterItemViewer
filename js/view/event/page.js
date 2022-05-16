

function clickPage(catecory, index)
{

  let beforeScrollY  = window.scrollY;
  for (let page of document.getElementsByClassName("page")) page.style.backgroundColor = "";

  pushedPageColoer(`page${catecory}${index}`);

  let id = document.getElementById("data");

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

  console.log(this.currentData);

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
