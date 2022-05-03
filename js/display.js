function displayData()
{
  let charactors = this.charactors;
  let shareBanks = this.shareBanks;

  // 詳細表示
  if (charactors.length !== 0)
  {
    // 現在ページの情報を保存
    localStorage.setItem("currentpage", JSON.stringify(0));
    displayCharactor(charactors[0]);
  } else if (shareBanks.length !== 0)
  {
    // 現在ページの情報を保存
    localStorage.setItem("currentpage", JSON.stringify("shareBanks"));
    displayShareBank(shareBanks[0]);
  }

}

function displayItemCodes()
{
  let itemCodes;
  (this.lang === "JA")
    ? itemCodes = ItemCodes_JA()
    : itemCodes = ItemCodes();

  let id = document.getElementById("data");
  id.innerHTML = '';

  if (typeof itemCodes === "undefined") return;

  let div = document.createElement("div");
  div.setAttribute('class', "data_window");

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
  let tbody = document.createElement("tbody");

  if (Object.keys(itemCodes).lenght !== 0)
  {
    for (let key in itemCodes)
    {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      let text = document.createTextNode(key);
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
}

function displayCharactor(charactor)
{
  let id = document.getElementById("data");
  id.innerHTML = '';

  let div = document.createElement("div");
  div.setAttribute('class', "data_window");

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

  let tbody = document.createElement("tbody");

  tr(tbody, `SLOT : ${charactor.Slot}`);
  tr(tbody, `NAME : ${charactor.Name}`);
  tr(tbody, `GUILD CARD : ${charactor.GuildCardNumber}`);
  tr(tbody, `CLASS : ${charactor.Class}`);
  tr(tbody, `SECTION ID : ${charactor.SectionID}`);
  tr(tbody, `LEVEL : ${charactor.Level}`);
  tr(tbody, `EP1 CHALLENGE : ${charactor.Ep1Progress}`);
  tr(tbody, `EP2 CHALLENGE : ${charactor.Ep2Progress}`);

  table.appendChild(tbody);
  div.appendChild(table);
  let footer = document.createElement("div");
  footer.setAttribute('class', "data_footer");
  div.appendChild(footer);
  id.appendChild(div);

  displayInventory(charactor.Inventory[this.lang], "INVENTORY")
  displayInventory(charactor.Bank[this.lang], "BANK")
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
      let text = document.createTextNode(inventory[i][1]["display"]);
      td.appendChild(text);
      tr.appendChild(td);
      if (mode == "allItems")
      {
        let td2 = document.createElement("td");
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
}

function displayPager()
{
  let charactors = this.charactors;
  let shareBanks = this.shareBanks;
  let allItems = this.allItems;

  let id = document.getElementById("pager");
  id.innerHTML = '';

  // キャラクターのページを表示する
  if (Object.keys(charactors).length !== 0)
  {
    for( let i in charactors)
    {
      let button = document.createElement("button");
      button.setAttribute('id', `pager${charactors[i].Slot}`);
      button.setAttribute('class', "pager");
      button.setAttribute('name', i);
      button.setAttribute('onclick', 'clickCharactor(name)');
      button.innerText = charactors[i].Slot;
      id.appendChild(button);
    }
  }

  // 共有倉庫のページを表示する
  if (Object.keys(shareBanks).length !== 0)
  {
    for( let i in shareBanks)
    {
      let button = document.createElement("button");
      button.setAttribute('id', `pagerShareBank${[i]}`);
      button.setAttribute('class', "pager");
      button.setAttribute('name', i);
      button.setAttribute('onclick', 'clickShareBank(name)');
      button.innerText = "ShareBank";
      id.appendChild(button);
    }
  }

  // 全アイテムのページを表示する
  if (Object.keys(allItems).length !== 0)
  {
    let button = document.createElement("button");
    button.setAttribute('id', "allItems");
    button.setAttribute('class', "pager");
    button.setAttribute('name', "allItems");
    button.setAttribute('onclick', 'clickAllItems(name)');
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
    console.log(notification);
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
