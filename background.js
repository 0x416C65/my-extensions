chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.management.getAll(async function (extList) {
    extList.sort(function (a, b) {
      return a.name.localeCompare(b.name); // ordena a lista por nome
    });

    var html =
      '<html><head><title>Lista de Extensões</title><link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet"><style>body { font-family: "Open Sans", sans-serif; }</style></head><body><ol>';

    const getImageDataUrl = async function (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch {
        return 'https://via.placeholder.com/16';
      }
    };

    const extPromises = extList.map(async (ext, index) => {
      if (ext.type === 'extension') {
        const iconUrl =
          ext.icons && ext.icons.length > 0 ? ext.icons[0].url : '';
        const imageDataUrl = iconUrl
          ? await getImageDataUrl(iconUrl)
          : 'https://via.placeholder.com/16';

        return (
          '<li>' +
          (ext.enabled ? '' : '<span style="opacity: 0.5;">') +
          '<img src="' +
          imageDataUrl +
          '" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px;">' +
          '<a href="' +
          ext.homepageUrl +
          '" target="_blank">' +
          ext.name +
          '</a>' +
          (ext.enabled ? '' : '</span>') +
          '</li>'
        );
      } else {
        return '';
      }
    });

    const extHtmlList = await Promise.all(extPromises);

    html += extHtmlList.join('');
    html += '</ol></body></html>';

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url: url, filename: 'my-extensions.html' });
  });
});
