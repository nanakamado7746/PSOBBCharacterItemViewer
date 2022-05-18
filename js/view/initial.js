
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
function initializeDisplay()
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
    removeCharacterData();
    localStorage.removeItem("fileData");
  }
}
