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

function keyUpSearch()
{
  document.getElementById("wordsearch").addEventListener("keyup",function(){
    search();
  }, false);

  document.getElementById("elements").addEventListener('change', (event) => {
    changeSelectedColor(document.getElementById("elements"));
    search();
  });

  document.getElementById("hit").addEventListener('change', (event) => {
    changeSelectedColor(document.getElementById("hit"));
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

  // リストがない場合は終了
  if (data.length === 0) return data;

  // 検索ワードを変換する
  word = convertSearchWord(word);
  element = convertSearchWord(element);
  // 検索Hit値の全角を半角に変換
  hit = ZenkakuToHankaku(hit);

  console.log("search word converted:" + word);
  console.log("search element converted:" + element);
  console.log("search hit converted:" + hit);

  // typeの選択状態を表す
  let typeSelected = false;
  for (const type of types)
  {
    console.log(`search type ${type.value} => ${type.checked}`);
    if (type.checked) typeSelected = true;
  }

  // 検索結果初期値。検索欄未入力で全アイテムを表示する
  let searchResults = [];

  // 検索対象のアイテムの種類
  (typeSelected) ? searchResults = queryItemType(types, searchResults, data)
                 : searchResults = data; // typesがすべてfalse（未選択）だった場合、すべてのアイテムを対象にする。
  // 名前が指定された場合
  if (word !== "") searchResults = queryItemName(word, searchResults);
  // エレメント
  if (element !== "") searchResults = queryElement(element, searchResults);
  // 未鑑定アイテム
  if (unTekked) searchResults = queryUnTekked(searchResults);
  // HIT値
  if (hit !== "" & !isNaN(hit)) searchResults = queryHitValue(hit, searchResults);

  console.log("==== search results ====");
  console.log(searchResults);
  // 現在ページの情報を保存
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
  // レア武器、コモン武器の両方が選択されている場合、先に抽出する。
  if (isSearchedBothWeapon) searchResults = queryRareAndCommonWeapon(searchResults, data);

  for (const type of types)
  {
    if (type.checked)
    {
      // typeが選択されていると、選択状態をtrueにする
      searchResults = searchResults.concat(data.filter(function(x)
        {
          // すでに武器が抽出されている場合は武器の抽出をスキップする
          if (!isSearchedBothWeapon & type.value.split(":")[1] == "rare") return (x[1].type == 1 & x[1].rare === true);
          if (!isSearchedBothWeapon & type.value.split(":")[1] == "common") return (x[1].type == 1 & x[1].rare === false);
          // 武器以外
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
      // アイテム名を検索ワードと同じ条件で変換する。
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
        // 武器かS武器の場合、検索対象のエレメント名をカタカナ、大文字へ変換
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
  // 検索対象の全角を半角に変換
  // 検索対象のひらがなをかたかなに変換
  // 検索対象を大文字化、トリム
  return ZenkakuToHankaku(HiraganaToKatakana(str)).toUpperCase().trim();
}

function ZenkakuToHankaku(str)
{
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); });
}

function HiraganaToKatakana(str)
{
  return str.replace(/[ぁ-ん]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) + 0x60); });
}
