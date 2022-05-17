function displayData()
{
  const characters = this.characters;
  const shareBanks = this.shareBanks;

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
  (this.lang === "JA") ? itemCodes = ItemCodes_JA()
                       : itemCodes = ItemCodes();

  console.log(itemCodes);

  let id = document.getElementById("data");
  id.innerHTML = '';

  if (typeof itemCodes === "undefined") return;

  let div = tagCreater("div", "class::data_window", "id::data_window");
  let banner = tagCreater("div", "class::data_banner");
  let heading = tagCreater("div", "class::data_heading");
  let heading_left = tagCreater("div", "class::data_heading_left");
  let h2 = tagCreater("h2", "class::data_heading_body");
  h2.appendChild(document.createTextNode("ITEM CODES"));
  let heading_right = tagCreater("div", "class::data_heading_right");
  heading = appendChilds(heading, heading_left, h2, heading_right);
  banner.appendChild(heading);
  let header = tagCreater("div", "class::data_header");
  div = appendChilds(div, banner, header);

  let table = tagCreater("table", "class::data_body", "clas::data_cursor");
  let tbody = tagCreater("tbody");

  if (Object.keys(itemCodes).length !== 0)
  {
    for (let key in itemCodes)
    {
      let td = tdCreater(textNodeCreater("0x" + Number(key).toString(16).padStart(6, 0).toUpperCase()));
      let td2 = tdCreater(textNodeCreater(itemCodes[key]));
      tbody.appendChild(trCreater(td, td2));
    }
  }

  table.appendChild(tbody);
  div.appendChild(table);
  let footer = tagCreater("div", "class::data_footer");
  div.appendChild(footer);
  id.appendChild(div);
  setCursorAudio();
}

function displayCharacter(character)
{
  let id = document.getElementById("data");
  id.innerHTML = '';

  let div = tagCreater("div", "class::data_window", "id::data_window");
  let banner = tagCreater("div", "class::data_banner");
  let heading = tagCreater("div", "class::data_heading");
  let heading_left = tagCreater("div", "class::data_heading_left");
  let h2 = tagCreater("h2", "class::data_heading_body");
  h2.appendChild(document.createTextNode("CHARACTER"));
  let heading_right = tagCreater("div", "class::data_heading_right");
  let header = tagCreater("div", "class::data_header");
  heading = appendChilds(heading, heading_left, h2, heading_right);
  banner.appendChild(heading);
  div = appendChilds(div, banner, header);

  let table = tagCreater("table", "class::data_body", "class::data_cursor");
  let tbody = tagCreater("tbody");
  tbody.appendChild(trCreater(tdCreater(textNodeCreater(`SLOT : ${character.Slot}`))));
  tbody.appendChild(trCreater(tdCreater(textNodeCreater(`NAME : ${character.Name}`))));
  tbody.appendChild(trCreater(tdCreater(textNodeCreater(`GUILD CARD : ${character.GuildCardNumber}`))));
  tbody.appendChild(trCreater(tdCreater(textNodeCreater(`CLASS : ${character.Class}`))));
  let sectionid_image = tagCreater("img", "class::sectionid_image");
  sectionid_image.src = `./resources/images/icon/sectionid/${character.SectionID.toLowerCase()}.png`;
  tbody.appendChild(trCreater(tdCreater("class::sectionid", tagCreater("div", "class::sectionid_text", textNodeCreater("SECTION ID : ")), sectionid_image, tagCreater("div", "class::sectionid_text", textNodeCreater(character.SectionID)))));
  tbody.appendChild(trCreater(tdCreater(textNodeCreater(`LEVEL : ${character.Level}`))));
  tbody.appendChild(trCreater(tdCreater(textNodeCreater(`EP1 CHALLENGE : ${character.Ep1Progress}`))));
  tbody.appendChild(trCreater(tdCreater(textNodeCreater(`EP2 CHALLENGE : ${character.Ep2Progress}`))));
  table.appendChild(tbody);
  div.appendChild(table);

  let footer = tagCreater("div", "class::data_footer");
  div.appendChild(footer);
  id.appendChild(div);

  displayInventory(character.Inventory[this.lang], "INVENTORY");
  displayInventory(character.Bank[this.lang], "BANK");
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

  let div = tagCreater("div", "class::data_window", "id::data_window");
  let banner = tagCreater("div", "class::data_banner");

  let heading = tagCreater("div", "class::data_heading");
  let heading_left = tagCreater("div", "class::data_heading_left");
  let h2 = tagCreater("h2", "class::data_heading_body");
  h2.appendChild(document.createTextNode(title));
  let heading_right = tagCreater("div", "class::data_heading_right");
  heading = appendChilds(heading, heading_left, h2, heading_right);
  banner.appendChild(heading);

  let number = tagCreater("div", "class::data_number");
  let number_left = tagCreater("div", "class::data_number_left");
  let number_body = tagCreater("div", "class::data_number_body");
  number_body.appendChild(document.createTextNode(`${inventory.length}`));
  let number_right = tagCreater("div", "class::data_number_right");
  number = appendChilds(number, number_left, number_body, number_right);
  banner.appendChild(number);
  let header = tagCreater("div", "class::data_header");
  div = appendChilds(div, banner, header);

  let table = tagCreater("table", "class::data_body", "class::data_cursor");
  let tbody = tagCreater("tbody");

  if (inventory.length == 0)
  {
    // イベントリがからの場合、NO ITEMと表示
    tbody.appendChild(trCreater(tdCreater(textNodeCreater("NO ITEM"))));
  }

  if (inventory.length >= 0)
  {
    // インベントにアイテムがある場合
    for (let i in inventory)
    {
      let tr = tagCreater("tr");
      let td = tagCreater("td", "class::data_td_item");
      //
      if (inventory[i][1]["type"] == "5")
      {
        let color = tagCreater("div", "class::magcolor");
        color.style = `background-color: ${inventory[i][1]["rgb"]};`;
        td = appendChilds(td, document.createTextNode(inventory[i][1]["display_front"]),
                          color, document.createTextNode(inventory[i][1]["display_end"]));
      } else {
        let text = document.createTextNode(inventory[i][1]["display"]);
        td.appendChild(text);
      }
      tr.appendChild(td);

      // スロット列作成
      if (mode == "allItems")
      {
        let slotTd = tagCreater("td", "class::data_td_slot", document.createTextNode(`Slot: ${inventory[i][2]}`));
        tr.appendChild(slotTd);
      }
      tbody.appendChild(tr);
    }
  }

  table.appendChild(tbody);
  div.appendChild(table);
  let footer = tagCreater("div", "class::data_footer");
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
      let button = tagCreater("button", `id::pagecharacter${i}`, "class::page", `name::${i}`, `onclick::clickPage("character", name)`, `innerText::${characters[i].Slot}:${characters[i].Name}`);
      id.appendChild(button);
    }
  }

  // 共有倉庫のページを表示する
  if (Object.keys(shareBanks).length !== 0)
  {
    for( let i in shareBanks)
    {
      let button = tagCreater("button", `id::pageshareBank${i}`, "class::page", `name::${i}`, `onclick::clickPage("shareBank", name)`, "innerText::ShareBank");
      id.appendChild(button);
    }
  }

  // 全アイテムのページを表示する
  if (Object.keys(allItems).length !== 0)
  {
    let button = tagCreater("button", `id::pageallItemsdefault`, "class::page", `name::default`, `onclick::clickPage("allItems", name)`, "innerText::AllItems");
    id.appendChild(button);
  }
}

function displayNotification()
{
  console.log("====== notification ======");
  console.log(notification());

  let notifications = notification();
  let div = document.getElementById("notification");
  let table = tagCreater("table");
  let tbody = tagCreater("tbody");
  for ( const notification of notifications )
  {
    let tr = document.createElement("tr");
    let date = tdCreater(textNodeCreater(notification["date"]));
    let status = tdCreater(`class::${notification["status"]}`);
    let text = document.createElement("td");
    for (const line of notification["text"])
    {
      if (line.match(/linker/))
      {
        let linker = line.split("||");
        let a = tagCreater("a", `href::${linker[2]}`, `target::_blank`, textNodeCreater(linker[1]));
        text.appendChild(a);
      } else {
        let p = document.createElement("p");
        if (notification["status"] === "resolved")
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

function tagCreater(tagName, args)
{
  let tag = document.createElement(tagName);
  for (let i = 1; i < arguments.length; i++)
  {
    if (typeof arguments[i] === "string") {
      const tmp = arguments[i].split("::");
      if (tmp[0] === "class") tag.classList.add(tmp[1]);
      else if (tmp[0] === "innerText") tag.innerText = tmp[1];
      else tag.setAttribute(tmp[0], tmp[1]);
    } else {
      tag.appendChild(arguments[i]);
    }
  }
  return tag;
}

function appendChilds(tag, childs)
{
  for (let i = 1; i < arguments.length; i++)
  {
    tag.appendChild(arguments[i]);
  }
  return tag;
}

function textNodeCreater(text)
{
  return document.createTextNode(text);
}

function tdCreater(args)
{
  let td = document.createElement("td");
  for (const node of arguments)
  {
    if (typeof node === "string") {
      const tmp = node.split("::");
      if (tmp[0] === "class") td.classList.add(tmp[1]);
      else if (tmp[0] === "innerText") td.innerText = tmp[1];
      else td.setAttribute(tmp[0], tmp[1]);
    } else {
      td.appendChild(node);
    }
  }
  return td;
}

function trCreater(td)
{
  let tr = document.createElement("tr");
  for (const td of arguments)
  {
    tr.appendChild(td);
  }
  return tr;
}
