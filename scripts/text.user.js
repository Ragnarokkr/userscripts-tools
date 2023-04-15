// ==UserScript==
// @name         Userscripts Tools - Text
// @description  Misc tools to process text on web pages.
// @version      0.3
// @author       ragnarøkkr
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {

  // Map the browser language to the mostly expectable preferred 1st level domain
  // WIP: currently it only supports Italy and US/UK variants. Add new mappings as
  // required. 
  const langToDomainMapper = lang => {
    const mapping = {
      'it-IT': 'it',
      'en-US': 'com',
      'en-UK': 'co.uk',
    };
    return mapping[lang] ?? 'com';
  }

  // Converts the selected text to lowercase while preserving any HTML code contained in it.
  const replaceSelectedTextWithLowerCase = () => {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let range = selection.getRangeAt(0);
      let text = range.toString();
      let htmlTags = [];
      let newText = text.replace(/<.*?>/g, function (match) {
        htmlTags.push(match);
        return "{{{" + (htmlTags.length - 1) + "}}}";
      });
      newText = newText.toLowerCase();
      newText = newText.replace(/{{{\d+}}}/g, function (match) {
        let tagIndex = parseInt(match.slice(3, -3));
        return htmlTags[tagIndex];
      });
      let newNode = document.createElement('span');
      newNode.innerHTML = newText;
      range.deleteContents();
      range.insertNode(newNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  const onClick_ReplaceSelectedTextWithLowerCase = () => {
    replaceSelectedTextWithLowerCase();
  }

  // Copy current active webpage's title into the clipboard
  const copyPageTitle = () => {
    GM_setClipboard(document.title);
  };

  const onClick_CopyPageTitle = () => {
    copyPageTitle();
  };

  // Search selected text on Amazon
  const searchOnAmazon = () => {
    const selectedText = window.getSelection().toString();
    const lvl1domain = langToDomainMapper(navigator.language);
    const searchUrl = `https://www.amazon.${lvl1domain}/s?k=${encodeURIComponent(selectedText)}`;
    GM_openInTab(searchUrl);
  };

  const onClick_SearchOnAmazon = () => {
    searchOnAmazon();
  };

  // Registering the menu
  const menu = [
    { title: 'Convert selected text to lowercase (preserving HTML)', callback: onClick_ReplaceSelectedTextWithLowerCase, shortcut: 'l' },
    { title: 'Copy current page\'s title into the clipboard', callback: onClick_CopyPageTitle, shortcut: 'c' },
    { title: 'Search selected text on Amazon', callback: onClick_SearchOnAmazon, shortcut: 'a' },
  ];

  for (const menuItem of menu) {
    GM_registerMenuCommand(menuItem.title, menuItem.callback, menuItem.shortcut);
  }
})();