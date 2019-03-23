import WhatSlackListener from './model/WhatSlackListener';

(() => {
  let listener;

  // Add listener for content script messages
  window.addEventListener('message', e => {
    if(e.source !== window)
      return;

    if(e.data.action === 'START_APP')
      makeStore().then(() => {
        if(!listener) {
          console.log('[WhatSlack #inject] # Starting with received data:', e.data.content);
          listener = new WhatSlackListener(e.data.content);
          listener.updateChats();
          listener.start();
        }
      });

  }, false);

  window.handleSelect = select => {
    if(!select)
      return;

    console.info('[WhatSlack #inject]   handleSelect');
    const option = select.querySelector('option:checked');

    if(option)
      listener.updateForward(option.dataset.chatId, option.dataset.channelId);
  };

  document.querySelector('#app').addEventListener('click', () => setTimeout(makePane, 10));

  const makeStore = () => {
    console.info('[WhatSlack #inject]   makeStore');
    return new Promise((resolve, reject) => {
      if(!window.Store) {
        function getStore(modules) {
          let foundCount = 0;
          const neededObjects = [
            { id: 'Store', conditions: module => (module.Chat && module.Msg) ? module : null },
            { id: 'Wap', conditions: module => (module.createGroup) ? module : null },
            { id: 'MediaCollection', conditions: module => (module.default && module.default.prototype && module.default.prototype.processFiles !== undefined) ? module.default : null },
            { id: 'WapDelete', conditions: module => (module.sendConversationDelete && module.sendConversationDelete.length === 2) ? module : null },
            { id: 'Conn', conditions: module => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
            { id: 'WapQuery', conditions: module => (module.queryExist) ? module : null },
            { id: 'ProtoConstructor', conditions: module => (module.prototype && module.prototype.constructor.toString().indexOf('binaryProtocol deprecated version') >= 0) ? module : null },
            { id: 'UserConstructor', conditions: module => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null }
          ];

          for(const idx in modules) {
            if((typeof modules[ idx ] === 'object') && (modules[ idx ] !== null)) {
              const first = Object.values(modules[ idx ])[ 0 ];
              if((typeof first === 'object') && (first.exports)) {
                for(const idx2 in modules[ idx ]) {
                  const module = modules(idx2);
                  if(!module)
                    continue;

                  neededObjects.forEach(needObj => {
                    if(!needObj.conditions || needObj.foundedModule) return;
                    const neededModule = needObj.conditions(module);
                    if(neededModule !== null) {
                      foundCount++;
                      needObj.foundedModule = neededModule;
                    }
                  });

                  if(foundCount === neededObjects.length)
                    break;
                }

                const neededStore = neededObjects.find(needObj => needObj.id === 'Store');
                window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
                neededObjects.splice(neededObjects.indexOf(neededStore), 1);
                neededObjects.forEach(needObj => {
                  if(needObj.foundedModule)
                    window.Store[ needObj.id ] = needObj.foundedModule;
                });

                return window.Store;
              }
            }
          }
        }

        //setTimeout( () => {
        webpackJsonp([], { parasite: (x, y, z) => getStore(z) }, 'parasite');
        resolve();
        //}, 5000 );
      } else {
        reject();
      }
    });
  };

  const makePane = () => {
    if(document.querySelector('.whtslck'))
      return; // because pane was already added to DOM.

    const sidebar = document.querySelector('.three .copyable-area > div > div');
    const container = sidebar ? sidebar.querySelector('.copyable-text') : false;
    if(!container)
      return; // because the sidebar is not open.

    console.info('[WhatSlack #inject]   makePane');

    let chatName = container.innerHTML;
    if(container.querySelector('.emoji'))
      chatName = chatName
        .split('<img ')
        .map(p => p.startsWith('class=') ? p.match(/data-plain-text="(\S+)"/)[ 1 ] : p)
        .join('');

    const chatMatches = listener.chats.filter(c => c.name === chatName);
    let htmlId, htmlPane;

    console.log('[WhatSlack #inject] # Retrieved info for', chatName, ':', chatMatches);

    if(chatMatches.length === 0) {
      htmlPane = `<div class="whtslck">
                <div class="wtitle">WhatSlack message forwarding</div>
                This chat is not known to WhatSlack (perhaps because it is very new?). Reloading WhatsApp Web should fix this issue.
                <button onclick="location.reload();">Reload</button>
            </div>`;
    } else if(chatMatches.length !== 1) {
      htmlPane = `<div class="whtslck">
                <div class="wtitle">WhatSlack message forwarding</div>
                You have multiple conversations with the same chat name, making WhatSlack unable to identify which chat is which.
                Forwarding will still work (because it uses unique IDs rather than names), but you cannot edit your forwarding rules
                from here for now. Clearing WhatSlack's save data might fix this issue.
                <button onclick="window.postMessage({action: 'OPEN_OPTIONS'});">Options</button>
            </div>`;
    } else { // chatMatches.length === 1
      const chat = chatMatches[ 0 ];
      const forward = listener.forwards.find(f => f.chatId === chat.id);

      if(forward) {
        const channel = listener.channels.find(c => c.id === forward.channelId);

        if(channel) {
          chat.channelId = channel.id;
          chat.channelName = channel.name;
        }
      }

      htmlId = `<span class="whtsppid" title="${chat.name}'s WhatsApp ID is ${chat.id}">${chat.id}</span>`;
      htmlPane = `<div class="whtslck">
            	<div class="wtitle">Message forwarding</div>
                Slack channel to forward new messages in this conversation to:
                <select onchange="handleSelect(this)">
                    <option data-chatId="${chat.id}" data-channelId="" ${chat.channelId ? '' : 'selected'}>Don't forward</option>
                    ${listener.channels.map(
    c => `<option data-chat-id="${chat.id}" data-channel-id="${c.id}" ${c.id === chat.channelId ? 'selected' : ''}>#${c.name}</option>`
  )}
                </select>
            </div>`;
    }

    if(htmlId) {
      const fragId = document.createRange().createContextualFragment(htmlId);
      container.parentNode.style.flexWrap = 'wrap';
      container.parentNode.style.paddingBottom = '10px';
      container.parentNode.appendChild(fragId);
    }
    if(htmlPane) {
      const fragPane = document.createRange().createContextualFragment(htmlPane);
      sidebar.insertBefore(fragPane, sidebar.children[ 4 ]);
    }
  };

  console.info('[WhatSlack #inject]   loaded');
})();
