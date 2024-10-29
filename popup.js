document.addEventListener('DOMContentLoaded', function () {
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const counter = document.getElementById('counter');

  // Get the current tab and send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'getCount' },
      function (response) {
        if (response && response.total > 0) {
          counter.textContent = `${response.current + 1}/${response.total}`;
        } else {
          counter.textContent = '0/0';
        }
      }
    );
  });

  prevButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'previous' },
        function (response) {
          if (response) {
            counter.textContent = `${response.current + 1}/${response.total}`;
          }
        }
      );
    });
  });

  nextButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'next' },
        function (response) {
          if (response) {
            counter.textContent = `${response.current + 1}/${response.total}`;
          }
        }
      );
    });
  });
});
