function getCurrentTabUrl (callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  browser.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Get the URL of the Current tab the call the "callback"
  getCurrentTabUrl((tabUrl) => {

    if (tabUrl.length > 150) { // If the length of the URL is greater than 150 chars
      // It uses the Framalink URL Shortener
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {// Connected
          new QRCode(document.getElementById("qrcode"), JSON.parse(this.responseText).short);
        }
        if (this.readyState == 4 && this.status == 0) {// No Internet Connection
          new QRCode(document.getElementById("qrcode"), tabUrl);
        }
        console.log(this.responseText);
      };
      xhttp.open("POST", "https://frama.link/a", true);
      xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhttp.send("lsturl="+encodeURI(tabUrl)+"&format=json");
    } else { // URL is short
      new QRCode(document.getElementById("qrcode"), tabUrl);
    }
  });
});
