function displayItemCodes()
{
  let itemCodes = this.itemCodes;
  let id = document.getElementById("data");
  id.innerHTML = '';
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

function displayInputItemCodesDetail()
{
  let itemCodes = this.itemCodes;
  let itemCodeInputDate = this.itemCodeInputDate;

  //　初期化
  let id = document.getElementById("inputItemCodesDescription");
  id.innerHTML = '';
  let id2 = document.getElementById("inputItemCodesDetail");
  id2.innerHTML = '';

  if (Object.keys(itemCodes).length !== 0)
  {
    // 説明文
    let description = document.createElement("p");
    description.appendChild(document.createTextNode("You have inputted the item codes. Please re-input your character data."));
    id.appendChild(description);

    // アイテムコードの数
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(`◆ Number of item codes inputted : ${Object.keys(itemCodes).length}`));
    id2.appendChild(p);

    // アイテムコードを入力した日時
    let p2 = document.createElement("p");
    p2.appendChild(document.createTextNode(`◆ Date inputted : ${itemCodeInputDate}`));
    id2.appendChild(p2);
  }
  else
  {
    // 説明文
    let description = document.createElement("p");
    description.appendChild(document.createTextNode("Please Input the addon item code file (items_list.lua). It can be displayed with the latest item code. (Not covered by warranty)"));
    id.appendChild(description);
  }
}


function displayCharactorDetail()
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

function displayCharactor(charactor)
{
  let id = document.getElementById("data");
  id.innerHTML = '';

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("CHARACTOR"));
  id.appendChild(h2);
  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let text = document.createTextNode(`SLOT : ${charactor.Slot}`);
  td.appendChild(text);
  tr.appendChild(td);
  tbody.appendChild(tr);
  table.appendChild(tbody);
  id.appendChild(table);

  displayInventory(id, charactor.Inventory, "INVENTORY")
  displayInventory(id, charactor.Bank, "BANK")
}

function displayShareBank(shareBank, title)
{
  let id = document.getElementById("data");
  id.innerHTML = '';
  displayInventory(id, shareBank.ShareBank, "SHARE BANK")
}

function displayInventory(id, inventory, title, mode)
{
  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode(title));
  id.appendChild(h2);

  let table = document.createElement("table");
  let tbody = document.createElement("tbody");

  console.log(inventory);
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
  resetInnerHtml("pager");

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

function getDate()
{
  let date = new Date();
  return date.toLocaleString();
}

function resetInnerHtml(id)
{
  document.getElementById(id).innerHTML = '';
}
