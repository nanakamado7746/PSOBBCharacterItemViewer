// 入力データ
var lang = "EN";
// デコード済みデータ
var characters = [];
var shareBanks = [];
var allItems = [];
var searchResults = [];
var currentData = {};

var cursor_audios = [
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
  new Audio("./resources/sounds/se/cursor.wav"),
]

var cancel_audios = [
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
  new Audio("./resources/sounds/se/cancel.wav"),
]

var open_audios = [
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav"),
  new Audio("./resources/sounds/se/open.wav")
]

var enter_audios = [
  new Audio("./resources/sounds/se/enter.wav")
]

// 初期表示
initializeVolume();
initializeLang();
initializeTheme();
displayNotification();
initializeDisplay();
// DOM取得後の初期表示
window.addEventListener('load', function(){
  refreshVolume();
  displayAfterEnterd();
  keyUpSearch();
}, false);
