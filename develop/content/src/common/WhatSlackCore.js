export default class WhatSlackCore {
  constructor() {
    this.prefs = {};
    this.forwards = [];
    this.chats = [];
    this.contacts = [];
    this.channels = [];
  }

  init() {
    console.info('[WhatSlackCore]       init');
    return new Promise((resolve, reject) => {
      let error;
      Promise.all([ this.fetchPrefs(), this.fetchForwards(), this.fetchChats(), this.fetchContacts() ])
        .then(data => {
          this.prefs = { ...this.prefs, ...data[0] };
          this.forwards = data[ 1 ];
          this.chats = data[ 2 ];
          this.contacts = data[ 3 ];
        })
        .catch(err => {
          error = err;
        })
        .finally(() => {
          this.fetchChannels()
            .then(data => {
              this.channels = data;
            })
            .catch(err => {
              error = err;
            })
            .finally(() => {
              if(error)
                reject(error);
              else
                resolve();
            });
        });
    });
  }

  fetchPrefs() {
    console.info('[WhatSlackCore]       fetchPrefs');
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ 'prefs' ], data => {
        if(chrome.runtime.lastError)
          reject(chrome.runtime.lastError.message);
        else
          resolve(data.prefs ? data.prefs : {});
      });
    });
  }

  savePrefs(data) {
    console.info('[WhatSlackCore]       savePrefs');
    return new Promise(resolve => {
      chrome.storage.local.set({ prefs: data ? data : this.prefs }, () => {
        if(data)
          this.prefs = data;
        console.info('[WhatSlackCore]       Saved:', { prefs: this.prefs });
        resolve(this.prefs);
      });
    });
  }

  fetchForwards() {
    console.info('[WhatSlackCore]       fetchForwards');
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ 'forwards' ], data => {
        if(chrome.runtime.lastError)
          reject(chrome.runtime.lastError.message);
        else
          resolve(data.forwards ? this.forwards : []);
      });
    });
  }

  saveForwards(data) {
    console.info('[WhatSlackCore]       saveForwards');
    return new Promise(resolve => {
      chrome.storage.local.set({ forwards: data ? data : this.forwards }, () => {
        if(data)
          this.forwards = data;
        console.info('[WhatSlackCore]       Saved:', { forwards: this.forwards });
        resolve(this.forwards);
      });
    });
  }

  clearForwards() {
    return this.saveForwards([]);
  }

  fetchChats() {
    console.info('[WhatSlackCore]       fetchChats');
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ 'chats' ], data => {
        if(chrome.runtime.lastError)
          reject(chrome.runtime.lastError.message);
        else
          resolve(data.chats ? data.chats : []);
      });
    });
  }

  saveChats(data) {
    console.info('[WhatSlackCore]       saveChats');
    return new Promise(resolve => {
      chrome.storage.local.set({ chats: data ? data : this.chats }, () => {
        if(data)
          this.chats = data;
        console.info('[WhatSlackCore]       Saved:', { chats: this.chats });
        resolve(this.chats);
      });
    });
  }

  clearChats() {
    return this.saveChats([]);
  }

  fetchContacts() {
    console.info('[WhatSlackCore]       fetchContacts');
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([ 'contacts' ], data => {
        if(chrome.runtime.lastError)
          reject(chrome.runtime.lastError.message);
        else
          resolve(data.contacts ? data.contacts : []);
      });
    });
  }

  saveContacts(data) {
    console.info('[WhatSlackCore]       saveContacts');
    return new Promise(resolve => {
      chrome.storage.local.set({ contacts: data ? data : this.contacts }, () => {
        if(data)
          this.contacts = data;
        console.info('[WhatSlackCore]       Saved:', { contacts: this.contacts });
        resolve(this.contacts);
      });
    });
  }

  clearContacts() {
    return this.saveContacts([]);
  }

  fetchChannels() {
    console.info('[WhatSlackCore]       fetchChannels');
    return new Promise((resolve, reject) => {
      if(!this.prefs.slackToken)
        return reject('Cannot connect to Slack: no OAuth token was provided.');

      const url = 'https://slack.com/api/conversations.list';
      const params = Object.entries({
        exclude_archived: true, // eslint-disable-line
        limit: 1000,
        types: 'private_channel,public_channel'
      }).map(e => `${e[0]}=${encodeURIComponent(e[1])}`).join('&');

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${this.prefs.slackToken}`);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      fetch(`${url}?${params}`, { method: 'GET', headers })
        .then(response => response.json())
        .then(data => {
          if(data.ok)
            resolve(data.channels.map(c => ({ id: c.id, name: c.name })));
          else if(data.error === 'invalid_auth')
            reject('Cannot connect to Slack: the provided OAuth token is invalid.');
          else
            reject(`Slack API returned an error: ${data.error}.`);
        })
        .catch(err => reject(err));
    });
  }
}
