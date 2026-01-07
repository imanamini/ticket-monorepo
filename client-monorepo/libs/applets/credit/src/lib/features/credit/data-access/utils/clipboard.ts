const Clipboard = ((window, document, navigator) => {
  let textArea: any;
  let copy;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text: any) {
    textArea = document.createElement('textArea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.zIndex = -10000;
    textArea.style.top = 0;
    textArea.style.opacity = 0;
    textArea.readOnly = true;
    document.body.appendChild(textArea);
  }

  function selectText() {
    let range;
    let selection;

    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea!);
      selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textArea?.setSelectionRange(0, 999999);
    } else {
      textArea?.select();
    }
  }

  function copyToNavigator(text: string) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {});
    }
  }

  copy = (text: any) => {
    createTextArea(text);
    selectText();
    copyToNavigator(text);
  };

  return {
    copy,
  };
})(window, document, navigator);

export default Clipboard;
