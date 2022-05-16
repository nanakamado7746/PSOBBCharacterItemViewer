function displayData()
{
  let characters = this.characters;
  let shareBanks = this.shareBanks;

  // 詳細表示
  if (characters.length !== 0)
  {
    // 現在ページの情報を保存
    displayCharacter(characters[0]);
    this.currentData["page"] = "character";
    this.currentData["searching"] = ["character", 0, this.characters[0]];
    pushedPageColoer(`pagecharacter${0}`);
  } else if (shareBanks.length !== 0)
  {
    // 現在ページの情報を保存
    displayShareBank(shareBanks[0]);
    this.currentData["page"] = "shareBank";
    this.currentData["searching"] = ["shareBank", 0, this.shareBanks[0]];
    pushedPageColoer(`pageshareBank${0}`);
  }
}

function displayItemCodes()
{
  let itemCodes;
  (this.lang === "JA")
    ? itemCodes = ItemCodes_JA()
    : itemCodes = ItemCodes();

  console.log(itemCodes);

  let id = document.getElementById("data");
  id.innerHTML = '';

  if (typeof itemCodes === "undefined") return;

  let div = document.createElement("div");
  div.setAttribute('class', "data_window");
  div.setAttribute('id', "data_window");

  let banner = document.createElement("div");
  banner.setAttribute('class', "data_banner");

  let heading = document.createElement("div");
  heading.setAttribute('class', "data_heading");
  let heading_left = document.createElement("div");
  heading_left.setAttribute('class', "data_heading_left");
  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("ITEM CODES"));
  h2.setAttribute('class', "data_heading_body");
  let heading_right = document.createElement("div");
  heading_right.setAttribute('class', "data_heading_right");

  heading.appendChild(heading_left);
  heading.appendChild(h2);
  heading.appendChild(heading_right);
  banner.appendChild(heading);
  div.appendChild(banner);

  let header = document.createElement("div");
  header.setAttribute('class', "data_header");
  div.appendChild(header);

  let table = document.createElement("table");

  table.setAttribute('class', "data_body");
  table.classList.add("data_cursor");
  let tbody = document.createElement("tbody");

  if (Object.keys(itemCodes).length !== 0)
  {
    for (let key in itemCodes)
    {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      let text = document.createTextNode("0x" + Number(key).toString(16).padStart(6, 0).toUpperCase());
      td.appendChild(text);
      tr.appendChild(td);
      let td2 = document.createElement("td");
      let slot = document.createTextNode(itemCodes[key]);
      td2.appendChild(slot);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    }
  }

  table.appendChild(tbody);
  div.appendChild(table);
  let footer = document.createElement("div");
  footer.setAttribute('class', "data_footer");
  div.appendChild(footer);
  id.appendChild(div);
  setCursorAudio();
}

function displayCharacter(character)
{
  let id = document.getElementById("data");
  id.innerHTML = '';

  let div = document.createElement("div");
  div.setAttribute('class', "data_window");
  div.setAttribute('id', "data_window");

  let banner = document.createElement("div");
  banner.setAttribute('class', "data_banner");

  let heading = document.createElement("div");
  heading.setAttribute('class', "data_heading");
  let heading_left = document.createElement("div");
  heading_left.setAttribute('class', "data_heading_left");
  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("CHARACTER"));
  h2.setAttribute('class', "data_heading_body");
  let heading_right = document.createElement("div");
  heading_right.setAttribute('class', "data_heading_right");

  heading.appendChild(heading_left);
  heading.appendChild(h2);
  heading.appendChild(heading_right);
  banner.appendChild(heading);
  div.appendChild(banner);

  let header = document.createElement("div");
  header.setAttribute('class', "data_header");
  div.appendChild(header);

  let table = document.createElement("table");
  table.setAttribute('class', "data_body");
  table.classList.add("data_cursor");

  let tbody = document.createElement("tbody");

  tr(tbody, `SLOT : ${character.Slot}`);
  tr(tbody, `NAME : ${character.Name}`);
  tr(tbody, `GUILD CARD : ${character.GuildCardNumber}`);
  tr(tbody, `CLASS : ${character.Class}`);
  tr(tbody, `SECTION ID : ${character.SectionID}`);
  tr(tbody, `LEVEL : ${character.Level}`);
  tr(tbody, `EP1 CHALLENGE : ${character.Ep1Progress}`);
  tr(tbody, `EP2 CHALLENGE : ${character.Ep2Progress}`);

  table.appendChild(tbody);
  div.appendChild(table);
  let footer = document.createElement("div");
  footer.setAttribute('class', "data_footer");
  div.appendChild(footer);
  id.appendChild(div);

  displayInventory(character.Inventory[this.lang], "INVENTORY");
  displayInventory(character.Bank[this.lang], "BANK");
}

function tr(tbody, text)
{
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let node = document.createTextNode(text);
  td.appendChild(node);
  tr.appendChild(td);
  tbody.appendChild(tr);
}

function displayShareBank(shareBank, title)
{
  let id = document.getElementById("data");
  id.innerHTML = '';
  displayInventory(shareBank.ShareBank[this.lang], "SHARE BANK")
}

function displayInventory(inventory, title, mode)
{
  let id = document.getElementById("data");

  let div = document.createElement("div");
  div.setAttribute('class', "data_window");
  div.setAttribute('id', "data_window");

  let banner = document.createElement("div");
  banner.setAttribute('class', "data_banner");

  let heading = document.createElement("div");
  heading.setAttribute('class', "data_heading");
  let heading_left = document.createElement("div");
  heading_left.setAttribute('class', "data_heading_left");
  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode(title));
  h2.setAttribute('class', "data_heading_body");
  let heading_right = document.createElement("div");
  heading_right.setAttribute('class', "data_heading_right");

  heading.appendChild(heading_left);
  heading.appendChild(h2);
  heading.appendChild(heading_right);
  banner.appendChild(heading);

  let number = document.createElement("div");
  number.setAttribute('class', "data_number");
  let number_left = document.createElement("div");
  number_left.setAttribute('class', "data_number_left");
  let number_body = document.createElement("div");
  number_body.setAttribute('class', "data_number_body");
  number_body.appendChild(document.createTextNode(`${inventory.length}`));
  let number_right = document.createElement("div");
  number_right.setAttribute('class', "data_number_right");
  number.appendChild(number_left);
  number.appendChild(number_body);
  number.appendChild(number_right);
  banner.appendChild(number);

  div.appendChild(banner);

  let header = document.createElement("div");
  header.setAttribute('class', "data_header");
  div.appendChild(header);

  let table = document.createElement("table");
  table.setAttribute('class', "data_body");
  table.classList.add("data_cursor");

  let tbody = document.createElement("tbody");

  if (inventory.length == 0)
  {
    // イベントリがからの場合、NO ITEMと表示
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let text = document.createTextNode("NO ITEM");
    td.appendChild(text);
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    // インベントにアイテムがある場合
    for (let i in inventory)
    {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.setAttribute('class', "data_td_item");
      //
      if (inventory[i][1]["type"] == "5")
      {
        let color = document.createElement("div");
        color.setAttribute('class', "magcolor");
        color.style = `background-color: ${inventory[i][1]["rgb"]};`;
        td.appendChild(document.createTextNode(inventory[i][1]["display_front"]));
        td.appendChild(color);
        td.appendChild(document.createTextNode(inventory[i][1]["display_end"]));
      } else {
        let text = document.createTextNode(inventory[i][1]["display"]);
        td.appendChild(text);
      }
      tr.appendChild(td);

      // スロット列作成
      if (mode == "allItems")
      {
        let td2 = document.createElement("td");
        td2.setAttribute('class', "data_td_slot");
        let slot = document.createTextNode(`Slot: ${inventory[i][2]}`);
        td2.appendChild(slot);
        tr.appendChild(td2);
      }
      tbody.appendChild(tr);
    }
  }

  table.appendChild(tbody);
  div.appendChild(table);
  let footer = document.createElement("div");
  footer.setAttribute('class', "data_footer");
  div.appendChild(footer);
  id.appendChild(div);
  setCursorAudio();
}

function displayPager()
{
  let characters = this.characters;
  let shareBanks = this.shareBanks;
  let allItems = this.allItems;

  let id = document.getElementById("pager");
  id.innerHTML = '';

  // キャラクターのページを表示する
  if (Object.keys(characters).length !== 0)
  {
    for( let i in characters)
    {
      let button = document.createElement("button");
      button.setAttribute('id', `pagecharacter${i}`);
      button.setAttribute('class', "page");
      button.setAttribute('name', i);
      button.setAttribute('onclick', 'clickPage("character", name)');
      button.innerText = `${characters[i].Slot}:${characters[i].Name}`;
      id.appendChild(button);
    }
  }

  // 共有倉庫のページを表示する
  if (Object.keys(shareBanks).length !== 0)
  {
    for( let i in shareBanks)
    {
      let button = document.createElement("button");
      button.setAttribute('id', `pageshareBank${i}`);
      button.setAttribute('class', "page");
      button.setAttribute('name', i);
      button.setAttribute('onclick', 'clickPage("shareBank", name)');
      button.innerText = "ShareBank";
      id.appendChild(button);
    }
  }

  // 全アイテムのページを表示する
  if (Object.keys(allItems).length !== 0)
  {
    let button = document.createElement("button");
    button.setAttribute('id', `pageallItemsdefault`);
    button.setAttribute('class', "page");
    button.setAttribute('name', "allItems");
    button.setAttribute('onclick', 'clickPage("allItems", "default")');
    button.innerText = "AllItems";
    id.appendChild(button);
  }
}

function displayNotification()
{
  console.log("====== notification ======");
  console.log(notification());
  let notifications = notification();
  let div = document.getElementById("notification");
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  for ( let notification of notifications ) {
    let tr = document.createElement("tr");
    let date = document.createElement("td");
    date.textContent = notification["date"];
    let status = document.createElement("td");
    status.className = notification["status"];
    let text = document.createElement("td");
    for (let line of notification["text"])
    {
      if (line.match(/linker/))
      {
        let linker = line.split("||");
        let a = document.createElement("a");
        a.textContent = linker[1];;
        a.setAttribute('href', linker[2]);
        a.setAttribute('target', '_blank');
        text.appendChild(a);
      } else {
        let p = document.createElement("p");
        if (notification["status"] === "solved")
        {
          let del = document.createElement("del");
          del.textContent += line;
          p.appendChild(del);
        } else {
          p.textContent += line;
        }
        text.appendChild(p);
      }
    }
    tr.appendChild(date);
    tr.appendChild(status);
    tr.appendChild(text);
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  div.appendChild(table);
}

function displayAfterEnterd()
{
    if (localStorage.getItem("fileData") === null) {
      document.getElementById("afterEnterd").style.opacity = 0;
      document.getElementById("afterEnterd").style.height = 0;
    } else {
      document.getElementById("afterEnterd").style.opacity = 1;
      document.getElementById("afterEnterd").style.height = "auto";
    }
}
