chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.management.getAll(function (extList) {
    extList.sort(function (a, b) {
      return a.name.localeCompare(b.name); // ordena a lista por nome
    });
    var html =
      '<html><head><title>Lista de Extensões</title></head><body><ul style="list-style:auto;">';
    for (var i = 0; i < extList.length; i++) {
      var ext = extList[i];
      if (ext.type === 'extension' && ext.enabled) {
        html +=
          '<li><a href="' + ext.homepageUrl + '">' + ext.name + '</a></li>';
      }
    }
    html += '</ul></body></html>';
    var blob = new Blob([html], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    chrome.downloads.download({ url: url, filename: 'my-extensions.html' });
  });
});
