function clickDisplayItemCodes(event)
{
  this.currentData["page"] = "itemcode";
  let beforeScrollY = window.scrollY;

  displayItemCodes();

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
  
  playAudio(this.open_audios);
}
