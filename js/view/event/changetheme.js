
function clickChangeTheme(value)
{
  document.getElementById("stylesheet").href = `./css/${value}.css`;
  console.log("change to:" + value);
  localStorage.setItem("theme", value);
  refreshVolume();
  pushedPageColoer(`page${this.currentData["searching"][0]}${this.currentData["searching"][1]}`);
}
