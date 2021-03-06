function clickSearch(call)
{
  (hasSearchItem()) ? search()
                    : resetPage();
  playAudio(this.open_audios);
}

function clickReset()
{
  if (!hasSearchItem()) return;
  resetSearchItems();
  resetPage();
  playAudio(this.open_audios);
}

function clickDelete(id, tagName)
{
  if (!hasSearchItem()) return;
  switch (tagName)
  {
    case "input":
      document.getElementById(id).value = "";
      break;
    case "select":
      document.getElementById(id).selectedIndex = 0;
      changeSelectedColor(id);
      break;
    default:
  }
  search();
}

function keyUpSearch()
{
  document.getElementById("wordsearch").addEventListener("keyup",function(){
    search();
  }, false);

  document.getElementById("elements").addEventListener('change', (event) => {
    changeSelectedColor("elements");
    search();
  });

  document.getElementById("hit").addEventListener('change', (event) => {
    changeSelectedColor("hit");
    search();
  });
}

function search()
{
  const beforeScrollPosition = window.scrollY;
  const beforeStickyPosition = document.getElementById('sticky').getBoundingClientRect().top;
  let id = document.getElementById("data");
  id.innerHTML = '';

  let data = {};
  if (this.currentData["searching"][0] === "character") {
    data["EN"] = this.currentData["searching"][2].Inventory["EN"].concat(this.currentData["searching"][2].Bank["EN"]);
    data["JA"] = this.currentData["searching"][2].Inventory["JA"].concat(this.currentData["searching"][2].Bank["JA"]);
  }
  if (this.currentData["searching"][0] === "shareBank") data = this.currentData["searching"][2].Bank;
  if (this.currentData["searching"][0] === "allItems") data = this.currentData["searching"][2].Inventory;
  if (data.length === 0) return;

  displayInventory(query(data[this.lang]), "SEARCH RESULTS", "allItems")
  scroll(beforeScrollPosition, beforeStickyPosition);
}

function query(data)
{
  let word = document.getElementsByName("word")[0].value;
  let element = document.getElementById("elements").value;
  let hit = document.getElementById("hit").value;
  let unTekked = document.getElementsByName("unTekked")[0].checked;
  let types = document.getElementsByName("type");

  console.log("==== search all items ====");
  console.log(data);
  console.log("search word:" + word);
  console.log("search element:" + element);
  console.log("search hit:" + hit);
  console.log("search unTekked:" + unTekked);

  // ?????????????????????????????????
  if (data.length === 0) return data;

  // ??????????????????????????????
  word = convertSearchWord(word);
  element = convertSearchWord(element);
  // ??????Hit??????????????????????????????
  hit = ZenkakuToHankaku(hit);

  console.log("search word converted:" + word);
  console.log("search element converted:" + element);
  console.log("search hit converted:" + hit);

  // type????????????????????????
  let typeSelected = false;
  for (const type of types)
  {
    console.log(`search type ${type.value} => ${type.checked}`);
    if (type.checked) typeSelected = true;
  }

  // ???????????????????????????????????????????????????????????????????????????
  let searchResults = [];

  // ????????????????????????????????????
  (typeSelected) ? searchResults = queryItemType(types, searchResults, data)
                 : searchResults = data; // types????????????false??????????????????????????????????????????????????????????????????????????????
  // ??????????????????????????????
  if (word !== "") searchResults = queryItemName(word, searchResults);
  // ???????????????
  if (element !== "") searchResults = queryElement(element, searchResults);
  // ?????????????????????
  if (unTekked) searchResults = queryUnTekked(searchResults);
  // HIT???
  if (hit !== "" & !isNaN(hit)) searchResults = queryHitValue(hit, searchResults);

  console.log("==== search results ====");
  console.log(searchResults);
  // ?????????????????????????????????
  this.currentData["page"] = "searchResults";
  this.currentData["searchResults"] = searchResults;
  return searchResults;
}
function queryRareAndCommonWeapon(searchResults, data)
{
  return searchResults.concat(data.filter(function(x) { return (x[1].type == 1); }));
}

function queryItemType(types, searchResults, data)
{
  let isSearchedBothWeapon = (types[0].checked && types[1].checked);
  // ?????????????????????????????????????????????????????????????????????????????????????????????
  if (isSearchedBothWeapon) searchResults = queryRareAndCommonWeapon(searchResults, data);

  for (const type of types)
  {
    if (type.checked)
    {
      // type?????????????????????????????????????????????true?????????
      searchResults = searchResults.concat(data.filter(function(x)
        {
          // ????????????????????????????????????????????????????????????????????????????????????
          if (!isSearchedBothWeapon & type.value.split(":")[1] == "rare") return (x[1].type == 1 & x[1].rare === true);
          if (!isSearchedBothWeapon & type.value.split(":")[1] == "common") return (x[1].type == 1 & x[1].rare === false);
          // ????????????
          return (x[1].type == type.value);
        }
      ));
    }
  }
  return searchResults;
}

function queryItemName(word, searchResults)
{
  return searchResults.filter(function(x)
    {
      // ??????????????????????????????????????????????????????????????????
      const item = convertSearchWord(x[1].name);
      return item.match(word);
    }
  );
}

function queryElement(element, searchResults)
{
  return searchResults.filter(function(x)
    {
      if (x[1].type === Config.ItemType.WEAPON | x[1].type === Config.ItemType.SRANK_WEAPON)
      {
        // ?????????S???????????????????????????????????????????????????????????????????????????????????????
        const item = HiraganaToKatakana(x[1].element).toUpperCase();
        return item.match(element);
      }
    }
  );
}

function queryUnTekked(searchResults)
{
  return searchResults.filter(function(x)
    {
      if (x[1].type === 1) return x[1].tekked === false;
    }
  );
}

function queryHitValue(hit, searchResults)
{
  return searchResults.filter(function(x)
    {
      if (x[1].type === 1) return x[1].attribute["hit"] >= hit;
    }
  );
}

function convertSearchWord(str)
{
  // ???????????????????????????????????????
  // ???????????????????????????????????????????????????
  // ???????????????????????????????????????
  return ZenkakuToHankaku(HiraganaToKatakana(str)).toUpperCase().trim();
}

function ZenkakuToHankaku(str)
{
  return str.replace(/[???-??????-??????-???]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); });
}

function HiraganaToKatakana(str)
{
  return str.replace(/[???-???]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) + 0x60); });
}
