//綁定html元素
var url = "https://yishin26.github.io/HexPractice/opendata/mydata.json";
var infoCard = document.querySelector(".info-card");
var cityTitle = document.querySelector(".cityTitle");
var area = document.querySelector(".area");
var data, selector; //所有資料，所選城市
var nowAtPage;
var nowTotalPage;
var page = document.querySelector(".page");
var totalPage;

//資料請求
callAjax();
function callAjax() {
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
        //showdata(data);
      } else {
        alert("There was a problem with the request.");
      }
    }
  };
}

//主要偵測選單改變時，呼叫內容更新
area.addEventListener(
  "change",
  function(e) {
    selector = e.target.value;

    // 不是選到請選擇在去做執行
    if (selector != "") {
      // 重串url條件
      //var newurl = url + "&q=" + selector;
      // callAjax(newurl, 1);

      // callAjax(newurl, 2);
      updateList(1);
    }
  },
  false
);

//省略字數
function truncateText(txt, maxLength) {
  if (txt.length > maxLength) {
    txt = txt.substr(0, maxLength) + "...";
  }
  return txt;
}

//獲取選項的函式，先濾掉重複的城市名稱
var menus = [];
function showSelectList() {
  //初始化預設為苗栗
  selector = "苗栗縣";
  updateList(1);
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
function updateList(goPage) {
  var totalItem = 0; //目前總共幾筆
  var tempItem = [];
  for (var i = 0; i < data.length; i++) {
    if (selector == data[i].City) {
      //先算有幾個
      totalItem++;
      tempItem.push(data[i]);
    }
  }

  var currentPage = 1, // 目前頁數、總頁數， 一頁6筆資料
    totalPage = 0,
    perPage = 6,
    totalPage = Math.ceil(totalItem / perPage); //無條件進位

  //------
  var startItem, endItem;
  if (goPage == totalPage) {
    var minusItem = totalItem - totalPage * perPage;

    if (minusItem == 0) {
      //判斷最後一頁是幾筆，用 = 0 就是10筆
      startItem = (totalPage - 1) * perPage;
      endItem = totalItem;
    } else {
      // 小於10筆
      startItem = (totalPage - 1) * perPage;
      endItem = totalItem;
    }
  } else {
    startItem = perPage * (goPage - 1);
    endItem = goPage * 6;
  }
  nowTotalPage = totalPage;
  var boxStr = "";

  for (var i = startItem; i < endItem; i++) {
    boxStr +=
      " <div class='col s12 m4'><div class='card z-depth-4'> <div class='card-image'><img class='pic' src=" +
      tempItem[i].PicURL +
      " />  </div>";

    boxStr +=
      " <div class='card-content'><span class='card-title'>" +
      tempItem[i].Name +
      "</span><p ><strong><i class='Small material-icons'>map</i>地址：</strong>" +
      tempItem[i].Address +
      "</p>";
    boxStr +=
      "<p ><strong><i class='Small material-icons'>phone</i>電話：</strong>" +
      tempItem[i].Tel +
      "</p>";
    boxStr +=
      "<p class='hostWords'><strong><i class='Small material-icons'>info</i>簡介：</strong><br/>" +
      truncateText(tempItem[i].HostWords, 250) + //限制字數為300
      "</p> </div></div></div>";
  }

  //------
  // 紀錄目前頁數用來點選上下頁用
  currentPage = goPage;

  nowAtPage = currentPage;
  infoCard.innerHTML = boxStr;

  renderPage(totalPage);
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

// 渲染有幾頁用
function renderPage(totalPage) {
  if (data.length <= 0) {
    // 沒有資料的時候不顯示筆數
    page.style.display = "none";
  } else {
    page.style.display = "";
    var tempNum = [];
    // 模板
    var prevPage =
      '<a href="#" class="pageicon medium material-icons" data-num="-1">arrow_back</a> &nbsp;';
    var nexPage =
      ' &nbsp;<a href="#"class="pageicon  medium material-icons" data-num="1">arrow_forward</a>';
    if (totalPage > 0) {
      var nbrHtml = "";
      for (var i = 0; i < totalPage; i++) {
        var tempNbr =
          '<a class="pageNum" href="#" data-page="' +
          (i + 1) +
          '">' +
          (i + 1) +
          "</a> ";
        tempNum.push(i + 1);
        nbrHtml += tempNbr;
      }

      page.innerHTML = prevPage + nbrHtml + nexPage;
    }
  }
}

// 頁次偵聽
page.addEventListener("click", function(e) {
  e.preventDefault();
  if (e.target.nodeName == "A") {
    // 要前往哪一頁
    var goPage;
    var pervNext = Number(e.target.dataset.num);

    // 當有按下下一頁或上頁

    if (pervNext == -1 || pervNext == 1) {
      if (pervNext == -1) {
        if (nowAtPage + pervNext < 1) {
          return false;
        }
        goPage = nowAtPage - 1;
      } else if (pervNext == 1) {
        //console.log(nowTotalPage);
        if (nowAtPage + pervNext > nowTotalPage) {
          return false;
        }

        goPage = nowAtPage + 1;
      }
    } else {
      goPage = Number(e.target.dataset.page);
      if (nowAtPage == goPage) {
        return false;
      }
    }

    updateList(goPage);
  }
});
