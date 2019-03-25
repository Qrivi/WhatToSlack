import WhatSlackCore from './common/WhatSlackCore';
import WhatSlackLoader from './model/WhatSlackLoader';

(() => {
  const core = new WhatSlackCore();
  let loader, relay;

  core.init().then(() => {
    loader = new WhatSlackLoader(core);
    relay = new WhatSlackRelay();
  });

  window.addEventListener('message', e => {
    if(!loader || !relay)
      return;

    if(e.source !== window)
      return;

    if(e.data.action === 'HANDLE_MESSAGE')
      relay.handleMessage(model);

    if(e.data.action === 'SYNC_FORWARDS')
      core.saveForwards(e.data.content);

    if(e.data.action === 'SYNC_CHATS')
      core.saveChats(e.data.content);

    if(e.data.action === 'SYNC_CONTACTS')
      core.saveContacts(e.data.content);

    if(e.data.action === 'OPEN_OPTIONS')
      chrome.runtime.sendMessage({ action: e.data.action });

  }, false);
})();
