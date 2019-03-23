import WhatSlackCore from '../../common/WhatSlackCore';
import WhatSlackLoader from './model/WhatSlackLoader';

(() => {
  const loader = new WhatSlackLoader(new WhatSlackCore());

  window.addEventListener('message', e => {
    if(e.source !== window)
      return;

    if(e.data.action === 'HANDLE_EVENT')
      console.log('GOT EVENT', e.data.content);

    if(e.data.action === 'SYNC_FORWARDS')
      loader.saveForwards(e.data.content);

    if(e.data.action === 'SYNC_CHATS')
      loader.saveChats(e.data.content);

    if(e.data.action === 'SYNC_CONTACTS')
      loader.saveContacts(e.data.content);

    if(e.data.action === 'OPEN_OPTIONS')
      chrome.runtime.sendMessage({ action: e.data.action });

  }, false);
})();
