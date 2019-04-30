export default class WhatSlackLoader {
  constructor(core) {
    this.core = core;
    this.injectListener()
      .then(() => {
        window.postMessage({
          action: 'START_APP',
          content: {
            forwards: this.core.forwards,
            chats: this.core.chats,
            channels: this.core.channels,
            contacts: this.core.contacts
          }
        });
      })
      .catch(err => {
        window.postMessage({
          action: 'HANDLE_ERROR',
          content: err
        });
      });
  }

  injectListener() {
    console.info('[WhatSlackLoader]     injectListener');
    return new Promise((resolve, reject) => {
      try {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.type = 'text/css';
        l.href = chrome.extension.getURL('content/inject.css');

        const s = document.createElement('script');
        s.src = chrome.extension.getURL('content/inject.js');
        s.onload = function() {
          this.remove();
        };

        (document.head || document.documentElement).appendChild(l);
        (document.head || document.documentElement).appendChild(s);

        // For safety -- give the script some time to load
        setTimeout(resolve, 3000);
      } catch (err) {
        reject(err);
      }
    });
  }
}
