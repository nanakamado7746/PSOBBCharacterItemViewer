// DOM取得後の初期表示
window.addEventListener('load', function(){

  refreshVolume();
  displayAfterEnterd()
});

function initializeVolume()
{
  // firefox用
  document.getElementById("volume_range").value = 0;
}

function initializeTheme()
{
  if (localStorage.getItem("theme"))
  {
    this.theme = localStorage.getItem("theme");
    console.log("theme:" + this.theme);
    let theme = this.theme.replace(/\"/g,"");
    localStorage.setItem("theme", theme);
    document.getElementById("stylesheet").href = `./css/${theme}.css`;
  }
  if (theme !== "classic") {
    document.getElementsByName("themes")[1].checked = true;
  }
}


function initializeLang()
{
  if (localStorage.getItem("lang"))
  {
    this.lang = JSON.parse(localStorage.getItem("lang"));
    console.log("lang:" + this.lang);
  } else {
    localStorage.setItem("lang", JSON.stringify("EN"));
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
      this.fileData = JSON.parse(localStorage.getItem("fileData"));
      console.log(JSON.parse(localStorage.getItem("fileData")));
      decoder();
    }
    displayPager();
    displayData();
  }
  catch (e)
  {
    alert("error occurred. please super reload (F5)");
    console.log(e);
    document.getElementById("data").innerHTML = '';
    document.getElementById("pager").innerHTML = '';
    removeCharactorData();
    localStorage.removeItem("fileData");
  }
}
