function getCurrentTabUrl(callback) {
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

function shortenURL(url, callback) {
  if (url.length > 150) { // If the length of the URL is greater than 150 chars
    // It uses the Framalink URL Shortener
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) { // Connected
        if (this.responseText.length < 100) {
          callback(this.responseText);
        } else {
          callback(url);
        }
      }
      if (this.readyState == 4 && this.status == 0) { // No Internet Connection
        console.log("No internet !")
        callback(url);
      }
      if (this.readyState == 4) console.log("Answer : " + this.responseText);
    };
    xhttp.open("POST", "http://0x0.st", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send("shorten=" + encodeURIComponent(url));
  } else { // URL is short
    new QRCode(document.getElementById("qrcode"), url);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Get the URL of the Current tab the call the "callback"
  getCurrentTabUrl((tabUrl) => {
    shortenURL(tabUrl, (url) => {
      new QRCode(document.getElementById("qrcode"), url)
    })
  });
});
