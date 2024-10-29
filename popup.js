document.addEventListener('DOMContentLoaded', function () {
  const classInput = document.getElementById('classInput');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const counter = document.getElementById('counter');

  // Load saved class name if any
  chrome.storage.local.get('targetClass', function (data) {
    if (data.targetClass) {
      classInput.value = data.targetClass;
      updateCount();
    }
  });

  function updateCount() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: 'getCount',
          className: classInput.value,
        },
        function (response) {
          if (response && response.total > 0) {
            counter.textContent = `${response.current + 1}/${response.total}`;
          } else {
            counter.textContent = '0/0';
          }
        }
      );
    });
  }

  // Handle class name input
  classInput.addEventListener('input', function () {
    const className = classInput.value.trim();

    // Save the class name
    chrome.storage.local.set({ targetClass: className });

    // Reset navigation and update count
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: 'reset',
          className: className,
        },
        function (response) {
          updateCount();
        }
      );
    });
  });

  prevButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: 'previous',
          className: classInput.value,
        },
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
        {
          action: 'next',
          className: classInput.value,
        },
        function (response) {
          if (response) {
            counter.textContent = `${response.current + 1}/${response.total}`;
          }
        }
      );
    });
  });
});
