class DiffNavigator {
  constructor() {
    this.highlightedElements = [];
    this.currentIndex = -1;
    this.currentClass = '';
  }

  findHighlightedElements(className) {
    if (!className) {
      this.highlightedElements = [];
      this.currentIndex = -1;
      return;
    }

    if (className !== this.currentClass) {
      this.currentClass = className;
      this.highlightedElements = Array.from(
        document.getElementsByClassName(className)
      );
      this.currentIndex = this.highlightedElements.length > 0 ? 0 : -1;
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

  navigateToNext(className) {
    this.findHighlightedElements(className);
    if (this.highlightedElements.length === 0) return null;

    this.currentIndex =
      (this.currentIndex + 1) % this.highlightedElements.length;
    this.scrollToElement(this.highlightedElements[this.currentIndex]);
    return this.getState();
  }

  navigateToPrevious(className) {
    this.findHighlightedElements(className);
    if (this.highlightedElements.length === 0) return null;

    this.currentIndex =
      (this.currentIndex - 1 + this.highlightedElements.length) %
      this.highlightedElements.length;
    this.scrollToElement(this.highlightedElements[this.currentIndex]);
    return this.getState();
  }

  reset(className) {
    this.currentClass = '';
    this.findHighlightedElements(className);
    return this.getState();
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
      sendResponse(navigator.navigateToNext(request.className));
      break;
    case 'previous':
      sendResponse(navigator.navigateToPrevious(request.className));
      break;
    case 'getCount':
      navigator.findHighlightedElements(request.className);
      sendResponse(navigator.getState());
      break;
    case 'reset':
      sendResponse(navigator.reset(request.className));
      break;
  }
  return true;
});
