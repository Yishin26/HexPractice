//綁定html元素
var infoCard = document.querySelector(".info-card");
var cityTitle = document.querySelector(".cityTitle");
var area = document.querySelector(".area");
var data;

//資料請求
callAjax();
function callAjax() {
  var url = "https://yishin26.github.io/HexPractice/opendata/mydata.json";
  var xhr;

  if (window.XMLHttpRequest) {
    // Mozilla, Safari, ...
    xhr = new XMLHttpRequest();
    xhr.overrideMimeType("text/xml");
  } else if (window.ActiveXObject) {
    // IE
    try {
      xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }
  if (!xhr) {
    alert("Cannot create an XMLHTTP instance");
    return false;
  }
  xhr.open("get", url, true);
  xhr.send(null);

  /* Ajax http request has 5 states as your reference documents:
0   UNSENT  open() has not been called yet.
1   OPENED  send() has been called.
2   HEADERS_RECEIVED  send() has been called, and headers and status are available.
3   LOADING Downloading; responseText holds partial data.
4   DONE    The operation is complete.

*/

  xhr.onload = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var alldata = JSON.parse(xhr.responseText);
        data = alldata;
        showSelectList();

        area.addEventListener("change", updateList, false);

        //showdata(data);
      } else {
        alert("There was a problem with the request.");
      }
    }
  };
}

//省略字數
function truncateText(txt, maxLength) {
  if (txt.length > maxLength) {
    txt = txt.substr(0, maxLength) + "...";
  }
  return txt;
}

area.addEventListener("change", updateList, false);
//獲取選項的函式
var menus = [];
function showSelectList() {
  initial();
  for (var i = 0; i < data.length; i++) {
    var isNew = true;
    for (var m = 0; m < menus.length; m++) {
      if (menus[m] == data[i].City) {
        isNew = false;
      }
    }
    if (isNew) {
      menus.push(data[i].City);
    }
  }

  //把資料放進去select
  var addOpstion = "";
  for (var s = 0; s < menus.length; s++) {
    var menu = menus[s];
    addOpstion += '<option value="' + menu + '">' + menu + "</option>";
  }

  area.innerHTML = addOpstion;
}

//當滑鼠點擊或更換時促發
function updateList(e) {
  var selector = e.target.value;
  var boxStr = "";
  for (var i = 0; i < data.length; i++) {
    if (selector == data[i].City) {
      boxStr +=
        " <div class='col s12 m4'><div class='card z-depth-4'> <div class='card-image'><img class='pic' src=" +
        data[i].PicURL +
        " />  </div>";

      boxStr +=
        " <div class='card-content'><span class='card-title'>" +
        data[i].Name +
        "</span><p ><strong><i class='Small material-icons'>map</i>地址：</strong>" +
        data[i].Address +
        "</p>";
      boxStr +=
        "<p ><strong><i class='Small material-icons'>phone</i>電話：</strong>" +
        data[i].Tel +
        "</p>";
      boxStr +=
        "<p class='hostWords'><strong><i class='Small material-icons'>info</i>簡介：</strong><br/>" +
        truncateText(data[i].HostWords, 250) + //限制字數為300
        "</p> </div></div></div>";
    }
  }
  infoCard.innerHTML = boxStr;
}

//畫面進來時自動出現的
function initial() {
  var str = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i].City == "苗栗縣") {
      str +=
        " <div class='col s12 m4'><div class='card z-depth-4'> <div class='card-image'><img class='pic' src=" +
        data[i].PicURL +
        " />  </div>";

      str +=
        " <div class='card-content'><span class='card-title'>" +
        data[i].Name +
        "</span><p ><strong><i class='Small material-icons'>map</i>地址：</strong>" +
        data[i].Address +
        "</p>";
      str +=
        "<p ><strong><i class='Small material-icons'>phone</i>電話：</strong>" +
        data[i].Tel +
        "</p>";
      str +=
        "<p class='hostWords'><strong><i class='Small material-icons'>info</i>簡介：</strong><br/>" +
        truncateText(data[i].HostWords, 250) + //限制字數為300
        "</p> </div></div></div>";
    }
  }
  infoCard.innerHTML = str;
}

// 當有滾動的時候
window.onscroll = function() {
  // 移動的距離
  var scPos = window.pageYOffset;
  if (scPos > window.innerHeight / 5) {
    document.querySelector(".gototp").style.display = "";
  } else {
    document.querySelector(".gototp").style.display = "none";
  }
};

document.querySelector(".gototp").addEventListener("click", function(e) {
  scrollTo(0, 0);
});
