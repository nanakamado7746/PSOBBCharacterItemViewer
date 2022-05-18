
function clicVolumeSlider(value)
{
  setVolume(value);
}

function clicVolumeImage()
{
  let range = document.getElementById("volume_range");
  console.log(range.value);
  
  let volume = 0;
  if( Number(range.value) === 0) volume = 1;
  range.setAttribute('value', volume);
  setVolume(volume);
}
