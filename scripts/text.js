// ==UserScript==
// @name         Userscripts Tools - Text
// @description  Misc tools to process text on web pages.
// @version      0.2
// @author       ragnarøkkr
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {

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

    // Registering the menu
    const menu = [
        { title: 'Convert selected text to lowercase (preserving HTML)', callback: onClick_ReplaceSelectedTextWithLowerCase, shortcut: 'l' },
        { title: 'Copy current page\'s title into the clipboard', callback: onClick_CopyPageTitle, shortcut: 'c' }
    ];

    for (const menuItem of menu) {
        GM_registerMenuCommand(menuItem.title, menuItem.callback, menuItem.shortcut);
    }
})();