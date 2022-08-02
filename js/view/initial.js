
function initializeVolume()
{
  // firefox用
  document.getElementById("volume_range").value = 0;
}

function initializeTheme()
{
  let theme;
  if (localStorage.getItem("theme"))
  {
    theme = localStorage.getItem("theme").replace(/\"/g,"");
    console.log("theme:" + theme);
    document.getElementById("stylesheet").href = `./css/${theme}.css`;
    if (theme !== "classic") document.getElementsByName("themes")[1].checked = true;
  } else {
    localStorage.setItem("theme", "classic");
  }

}


function initializeLang()
{
  if (localStorage.getItem("lang"))
  {
    this.lang = localStorage.getItem("lang").replace(/\"/g,"");
    console.log("lang:" + this.lang);
  } else {
    localStorage.setItem("lang", "EN");
  }
  if (this.lang == "JA") {
    document.getElementsByName("lang")[1].checked = true;
  }
}

// ローカルストレージが存在していた場合、画面に表示する
function initializeFileData()
{
  try
  {
    if (localStorage.getItem("fileData"))
    {
      const fileData = JSON.parse(localStorage.getItem("fileData"));
      decodeAndDisplay(fileData);
    }
  }
  catch (e)
  {
    alert("error occurred. please super reload (F5)");
    console.log(e);
    document.getElementById("data").innerHTML = '';
    document.getElementById("pager").innerHTML = '';
    removeGlobalVariable();
    localStorage.removeItem("fileData");
  }
}

function intializeElementsList(index)
{
  let list;
  (this.lang == "EN")
    ? list = ElementsList()
    : list = ElementsList_JA();

  let select = document.getElementById("elements");
  select.appendChild(tag("option", `class::elements_option_top`, `value::${""}`, textNode("Special attack")));

  for (const value of list)
  {
    const option = tag("option", `class::elements_option_under`, `value::${value}`, textNode(value));
    select.appendChild(option);
  }

  select.selectedIndex = index;
  changeSelectedColor("elements");
}

function intializeHitList(index)
{
  let select = document.getElementById("hit");
  select.appendChild(tag("option", `class::hit_option_top`, `value::${""}`, textNode("Hit value")));
  for (let i = 0; i <= 100; i += 5)
  {
    const option = tag("option", `class::hit_option_under`, `value::${i}`, textNode(i));
    select.appendChild(option);
  }
  changeSelectedColor("hit");
}
