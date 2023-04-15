// ==UserScript==
// @name         Userscripts Tools - Web
// @description  Misc tools to process web pages.
// @version      0.2
// @author       ragnarøkkr
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @noframes
// ==/UserScript==

(() => {
  const SCRIPT_NAME = 'Userscripts Tools - Web';


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

  // Retrieve current YouTube video's cover image.
  const retrieveYouTubeCover = () => {
    if (!document.location.href.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i)) {
      GM_notification({
        title: `${SCRIPT_NAME} (Retrieve YouTube Cover)`,
        text: "Current active page must be a valid YouTube video.",
        ondone: () => { }
      });
      return;
    }
    const url = document.querySelector('link[itemprop="thumbnailUrl"]').href;
    GM_openInTab(url);
  }

  const onClick_RetrieveYouTubeCover = () => {
    retrieveYouTubeCover();
  }

  // Registering the menu
  const menu = [
    { title: 'Search for current webpage in Google\'s cache', callback: onClick_SearchInGoogleCache, shortcut: 'g' },
    { title: 'Retrieve current YouTube video\'s cover image', callback: onClick_RetrieveYouTubeCover, shortcut: 'y' }
  ];

  for (const menuItem of menu) {
    GM_registerMenuCommand(menuItem.title, menuItem.callback, menuItem.shortcut);
  }
})();