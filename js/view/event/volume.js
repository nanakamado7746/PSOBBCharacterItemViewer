
function clicVolumeSlider(value)
{
  setVolume(value);
}

function clicVolumeImage()
{
  let range = document.getElementById("volume_range");
  console.log(range.value);
  if( Number(range.value) === 0)
  {
    range.setAttribute('value', 1);
    setItemVolume(1);
  } else {
    range.setAttribute('value', 0);
    setVolume(0);
  }
}
