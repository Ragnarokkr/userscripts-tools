// ==UserScript==
// @name         Userscripts Tools - Web
// @description  Misc tools to process web pages.
// @version      0.1
// @author       ragnarøkkr
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {

    // Search on Google for a cached version of current active webpage.
    const searchInGoogleCache = () => {
        let url = `https://webcache.googleusercontent.com/search?q=cache:${document.location.origin}${document.location.pathname}`;
        GM_openInTab(url, {
            active: true
        });
    };

    const onClick_SearchInGoogleCache = () => {
        searchInGoogleCache();
    }

    // Registering the menu
    const menu = [
        { title: 'Search for current webpage in Google\'s cache', callback: onClick_SearchInGoogleCache, shortcut: 'l' }
    ];

    for (const menuItem of menu) {
        GM_registerMenuCommand(menuItem.title, menuItem.callback, menuItem.shortcut);
    }
})();