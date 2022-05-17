function removeCharacterData()
{
  this.characters = [];
  this.shareBanks = [];
  this.allItems = [];
}


function setVolume(value)
{

  console.log("change volume to:" + value);

  let img = document.getElementById("volume_img");
  (value > 0)
    ? img.setAttribute('src', "./resources/images/icon/volume_on.png")
    : img.setAttribute('src', "./resources/images/icon/volume_off.png");

  this.cursor_audios.map(item => item.volume = value);
  this.open_audios.map(item => item.volume = value);
  this.enter_audios.map(item => item.volume = value);
  this.cancel_audios.map(item => item.volume = value);
}


function setCursorAudio()
{
  let els = document.getElementsByClassName("data_cursor");
  for (const el of els)
  {
    el.onmouseover = function() {
      if (document.getElementById("volume_range").value > 0) {
        playAudioCursor();
      }
    }
  }
}

function playAudio(audios)
{
  if (isClassicTheme()) {
    for (const audio of audios)
    {
      if (audio.ended) audio.currentTime = 0;
      if (audio.currentTime !== 0) continue;
      audio.currentTime = 0;
      audio.play();
      break;
    }
  }
}

function refreshVolume()
{
  (isClassicTheme())
   ? setVolume(document.getElementById("volume_range").value)
   : setVolume(0);
}

function playAudioOpen()
{
  playAudio(this.open_audios);
}

function playAudioCursor()
{
  playAudio(this.cursor_audios);
}

function playAudioCancel()
{
  playAudio(this.cancel_audios);
}

function playAudioEnter() {}


function isClassicTheme()
{
  return localStorage.getItem("theme") === "classic";
}

function resetSearchItems()
{
  for (const type of document.getElementsByName("types"))
  {
    type.checked = false;
  }

  document.getElementsByName("word")[0].value = "";
  document.getElementsByName("element")[0].value = "";
  document.getElementsByName("hit")[0].value = "";
  document.getElementsByName("unTekked")[0].checked = false;
}

function pushedPageColoer(id)
{
  isClassicTheme()
    ? document.getElementById(id).style.backgroundColor = "#fb7c03"
    : document.getElementById(id).style.backgroundColor = "#D2B48C";
}
