class DiffNavigator {
  constructor() {
    this.highlightedElements = [];
    this.currentIndex = -1;
    this.findHighlightedElements();
  }

  findHighlightedElements() {
    this.highlightedElements = Array.from(
      document.getElementsByClassName('diff-html-added')
    );

    // If there are highlighted elements and we haven't selected one yet, start at the first
    if (this.highlightedElements.length > 0 && this.currentIndex === -1) {
      this.currentIndex = 0;
    }
  }

  scrollToElement(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    // Add a temporary highlight effect
    element.style.transition = 'background-color 0.3s';
    const originalBackground = element.style.backgroundColor;
    element.style.backgroundColor = '#fff7c6';

    setTimeout(() => {
      element.style.backgroundColor = originalBackground;
    }, 1000);
  }

  navigateToNext() {
    if (this.highlightedElements.length === 0) return;

    this.currentIndex =
      (this.currentIndex + 1) % this.highlightedElements.length;
    this.scrollToElement(this.highlightedElements[this.currentIndex]);
    return {
      current: this.currentIndex,
      total: this.highlightedElements.length,
    };
  }

  navigateToPrevious() {
    if (this.highlightedElements.length === 0) return;

    this.currentIndex =
      (this.currentIndex - 1 + this.highlightedElements.length) %
      this.highlightedElements.length;
    this.scrollToElement(this.highlightedElements[this.currentIndex]);
    return {
      current: this.currentIndex,
      total: this.highlightedElements.length,
    };
  }

  getState() {
    return {
      current: this.currentIndex,
      total: this.highlightedElements.length,
    };
  }
}

// Initialize the navigator
const navigator = new DiffNavigator();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'next':
      sendResponse(navigator.navigateToNext());
      break;
    case 'previous':
      sendResponse(navigator.navigateToPrevious());
      break;
    case 'getCount':
      sendResponse(navigator.getState());
      break;
  }
  return true;
});
