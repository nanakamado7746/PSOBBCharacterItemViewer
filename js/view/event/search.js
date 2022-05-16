
function clickSearch(call)
{
  search();
  playAudio(this.open_audios);
}

function clickReset()
{
  if (!hasSearchItem()) return;
  resetSearchItems();
  resetPage();
  playAudio(this.open_audios);
}

function dynamicSearch()
{
  document.getElementById("wordsearch").addEventListener("keyup",function(){
    console.log(localStorage.getItem("lang"));
    search(data, lang);
  }, false);
}


function search(call)
{
  let lang = this.lang; //　使ってない

  if (!hasSearchItem()) {
    resetPage();
    return;
  }

  let beforeScrollY = window.scrollY;
  let breforeStickyOffset = document.getElementById('sticky').offsetTop;
  let id = document.getElementById("data");
  id.innerHTML = '';

  let data = {};
  if (this.currentData["searching"][0] === "character") {
    data["EN"] = this.currentData["searching"][2].Inventory["EN"].concat(this.currentData["searching"][2].Bank["EN"]);
    data["JA"] = this.currentData["searching"][2].Inventory["JA"].concat(this.currentData["searching"][2].Bank["JA"]);
  }
  if (this.currentData["searching"][0] === "shareBank") data = this.currentData["searching"][2].ShareBank;
  if (this.currentData["searching"][0] === "allItems") data = this.currentData["searching"][2];
  if (data.length === 0) return;

  displayInventory(query(data, lang), "SEARCH RESULTS", "allItems")
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
}


function query(data, lang)
{


  let word = document.getElementsByName("word")[0].value;
  let element = document.getElementsByName("element")[0].value;
  let hit = document.getElementsByName("hit")[0].value;
  let unTekked = document.getElementsByName("unTekked")[0].checked;
  let types = document.getElementsByName("types");

  console.log("==== search all items ====");
  console.log(data);
  console.log("search word:" + word);
  console.log("search element:" + element);
  console.log("search hit:" + hit);
  console.log("search unTekked:" + unTekked);

  // リストがない場合は終了
  if (data.length === 0) return;

  // 検索結果初期値。検索欄未入力で全アイテムを表示する
  let result = [];

  // 検索ワードの全角を半角に変換
  // 検索ワードのひらがなをかたかなに変換
  // 検索ワードを大文字化、トリム
  word = word
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    .replace(/[ぁ-ん]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0x60);
    })
    .toUpperCase().trim();

  element = element
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    .replace(/[ぁ-ん]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0x60);
    })
    .toUpperCase().trim();

  // 検索Hit値の全角を半角に変換
  hit = hit.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });

  console.log("search word converted:" + word);
  console.log("search hit converted:" + hit);

  // typeの選択状態を表す
  let typeSelected = false;
  for (const value of types)
  {
    if (value.checked)
    {
      // typeが選択されていると、選択状態をtrueにする
      typeSelected = true;
      result = result.concat(data[lang].filter(function(x)
        {
            return (x[1].type == value.value);
        }
      ));
    }
  }

  // typesがすべてfalse（未選択）だった場合、すべてのアイテムを対象にする。
  if (!typeSelected) result = data[lang];


  // 名前が指定された場合
  if (word !== "")
  {
    result = result.filter(function(x)
      {

        // 検索対象の全角を半角に変換
        // 検索対象のひらがなをかたかなに変換
        // 検索対象を大文字化、トリム
        let target = x[1].name
          .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
          })
          .replace(/[ぁ-ん]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) + 0x60);
          })
          .toUpperCase();

        return target.match(word);
      }
    );
  }

  // エレメントが指定された場合
  if (element !== "")
  {
    result = result.filter(function(x)
      {
        if (x[1].type === 1 | x[1].type === 8)
        {
          // 武器かS武器の場合、検索対象のエレメント名をカタカナ、大文字へ変換
          target = x[1].element
            .replace(/[ぁ-ん]/g, function(s) {
              return String.fromCharCode(s.charCodeAt(0) + 0x60);
            })
            .toUpperCase();

          return target.match(element);
        }
      }
    );
  }

  if (unTekked)
  {
    result = result.filter(function(x)
      {
        if (x[1].type === 1) return x[1].tekked === false;
      }
    );
  }

  // HIT値
  if (hit !== "" & !isNaN(hit))
  {
    result = result.filter(function(x)
      {
        if (x[1].type === 1) return x[1].attribute["hit"] >= hit;
      }
    );
  }

  console.log("==== search results ====");
  console.log(result);

  this.searchResults = result;

  // 現在ページの情報を保存
  this.currentData["page"] = "searchResults";
  this.currentData["searchResults"] = this.searchResults;

  return result;
}

function hasSearchItem()
{
  let typesChecked = false;
  for (let type of document.getElementsByName("types"))
  {
    if (type.checked) typesChecked = true;
  }

  return ( !(typesChecked === false
      & document.getElementsByName("word")[0].value === ""
      & document.getElementsByName("element")[0].value === ""
      & document.getElementsByName("hit")[0].value === ""
      & document.getElementsByName("unTekked")[0].checked === false))
}

function resetPage()
{

  delete this.currentData["searchResults"];
  let beforeScrollY = window.scrollY;

  let id = document.getElementById("data");
  id.innerHTML = '';

  console.log(this.currentData);
  if ( this.currentData["searching"][0] === "character") {
    this.currentData["page"] = "character";
    displayCharacter(this.currentData["searching"][2]);
  }
  if ( this.currentData["searching"][0] === "shareBank") {
    this.currentData["page"] = "shareBank";
    displayShareBank(this.currentData["searching"][2]);
  }
  if ( this.currentData["searching"][0] === "allItems") {
    this.currentData["page"] = "allItems";
    displayInventory(this.currentData["searching"][2][this.lang], "ALL ITEMS", "allItems");
  }

  if (document.getElementById('sticky').getBoundingClientRect().top > 0 | beforeScrollY !== window.scrollY)
  {
    scrollTo(0, document.getElementById('data_window').getBoundingClientRect().top);
    scrollTo(0, beforeScrollY);
  }
  else if (document.getElementById('sticky').getBoundingClientRect().top === 0)
  {
    scrollTo(0, document.getElementById('data_window').getBoundingClientRect().top);
    document.getElementById('sticky').scrollIntoView();
  }
}