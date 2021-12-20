function displayData()
{
  let charactors = this.charactors;
  let shareBanks = this.shareBanks;

  // 詳細表示
  if (charactors.length !== 0)
  {
    displayCharactor(charactors[0]);
  } else if (shareBanks.length !== 0)
  {
    displayShareBank(shareBanks[0]);
  }
}


function displayItemCodes()
{
  let itemCodes;
  (this.jmode)
    ? itemCodes = getItemCodes_JA()
    : itemCodes = getItemCodes();

  let id = document.getElementById("data");
  id.innerHTML = '';

  if (typeof itemCodes === "undefined") return;

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("ITEM CODES"));
  id.appendChild(h2);

  let table = document.createElement("table");
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
  id.appendChild(table);
}

function displayCharactor(charactor)
{
  let id = document.getElementById("data");
  id.innerHTML = '';

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("CHARACTOR"));
  id.appendChild(h2);
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  tr(tbody, `SLOT : ${Number(charactor.Slot) + 1}`);
  tr(tbody, `NAME : ${charactor.Name}`);
  tr(tbody, `CLASS : ${charactor.Class}`);
  tr(tbody, `SECTION ID : ${charactor.SectionID}`);
  tr(tbody, `LEVEL : ${charactor.Level}`);
  table.appendChild(tbody);
  id.appendChild(table);

  displayInventory(id, charactor.Inventory, "INVENTORY")
  displayInventory(id, charactor.Bank, "BANK")
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
  displayInventory(id, shareBank.ShareBank, "SHARE BANK")
}

function displayInventory(id, inventory, title, mode)
{
  (this.jmode)
    ? inventory = inventory[1]
    : inventory = inventory[0];

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode(title));
  id.appendChild(h2);

  let table = document.createElement("table");
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
      let text = document.createTextNode(inventory[i][1]);
      td.appendChild(text);
      tr.appendChild(td);
      if (mode == "allItems")
      {
        let td2 = document.createElement("td");
        let slot = document.createTextNode(`SLOT: ${inventory[i][2]}`);
        td2.appendChild(slot);
        tr.appendChild(td2);
      }
      tbody.appendChild(tr);
    }
  }

  table.appendChild(tbody);
  id.appendChild(table);
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
      button.innerText = Number(charactors[i].Slot) + 1;
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

function resetInnerHtml(id)
{
  document.getElementById(id).innerHTML = '';
}
