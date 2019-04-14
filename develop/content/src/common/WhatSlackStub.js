export default class WhatSlackStub {
  constructor() {
    this.prefs = {};
    this.forwards = [];
    this.chats = [];
    this.contacts = [];
    this.channels = [];
  }

  init() {
    console.info('[WhatSlackStub]       init');
    return new Promise((resolve, reject) => {
      this.fetchPrefs()
        .then(data => {
          this.prefs = { ...this.prefs, ...data };
          Promise.all([ this.fetchForwards(), this.fetchChats(), this.fetchContacts(), this.fetchChannels() ])
            .then(data => {
              if(data[ 0 ])
                this.forwards = data[ 0 ];
              if(data[ 1 ])
                this.chats = data[ 1 ];
              if(data[ 2 ])
                this.contacts = data[ 2 ];
              if(data[ 3 ])
                this.channels = data[ 3 ];
              resolve();
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  fetchPrefs() {
    console.info('[WhatSlackStub]       fetchPrefs');
    return new Promise((resolve, reject) => {
      try{
        resolve(JSON.parse(window.localStorage.getItem('prefs')));
      } catch(err){
        reject(err);
      }
    });
  }

  savePrefs(data) {
    console.info('[WhatSlackStub]       savePrefs');
    return new Promise((resolve, reject) => {
      try{
        data = data ? data : this.prefs;
        window.localStorage.setItem('prefs', JSON.stringify(data));
        this.prefs = data;
        console.info('[WhatSlackStub]       Saved:', { prefs: this.prefs });
        resolve(this.prefs);
      } catch(err){
        reject(err);
      }
    });
  }

  fetchForwards() {
    console.info('[WhatSlackStub]       fetchForwards');
    return new Promise((resolve, reject) => {
      try{
        resolve(JSON.parse(window.localStorage.getItem('forwards')));
      } catch(err){
        reject(err);
      }
    });
  }

  saveForwards(data) {
    console.info('[WhatSlackStub]       saveForwards');
    return new Promise((resolve, reject) => {
      try{
        data = data ? data : this.forwards;
        window.localStorage.setItem('forwards', JSON.stringify(data));
        this.forwards = data;
        console.info('[WhatSlackStub]       Saved:', { forwards: this.forwards });
        resolve(this.forwards);
      } catch(err){
        reject(err);
      }
    });
  }

  clearForwards() {
    return this.saveForwards([]);
  }

  fetchChats() {
    console.info('[WhatSlackStub]       fetchChats');
    return new Promise((resolve, reject) => {
      try{
        resolve(JSON.parse(window.localStorage.getItem('chats')));
      } catch(err){
        reject(err);
      }
    });
  }

  saveChats(data) {
    console.info('[WhatSlackStub]       saveChats');
    return new Promise((resolve, reject) => {
      try{
        data = data ? data : this.chats;
        window.localStorage.setItem('chats', JSON.stringify(data));
        this.chats = data;
        console.info('[WhatSlackStub]       Saved:', { chats: this.chats });
        resolve(this.chats);
      } catch(err){
        reject(err);
      }
    });
  }

  clearChats() {
    return this.saveChats([]);
  }

  fetchContacts() {
    console.info('[WhatSlackStub]       fetchContacts');
    return new Promise((resolve, reject) => {
      try{
        resolve(JSON.parse(window.localStorage.getItem('contacts')));
      } catch(err){
        reject(err);
      }
    });
  }

  saveContacts(data) {
    console.info('[WhatSlackStub]       saveContacts');
    return new Promise((resolve, reject) => {
      try{
        data = data ? data : this.contacts;
        window.localStorage.setItem('contacts', JSON.stringify(data));
        this.contacts = data;
        console.info('[WhatSlackStub]       Saved:', { contacts: this.contacts });
        resolve(this.contacts);
      } catch(err){
        reject(err);
      }
    });
  }

  clearContacts() {
    return this.saveContacts([]);
  }

  fetchChannels() {
    console.info('[WhatSlackStub]       fetchChannels');
    return new Promise((resolve, reject) => {
      if(!this.prefs.slackToken)
        return reject('Cannot connect to Slack: no OAuth token was provided.');

      const url = 'https://slack.com/api/conversations.list';
      const params = Object.entries({
        token: this.prefs.slackToken,
        exclude_archived: true, // eslint-disable-line
        limit: 1000,
        types: 'private_channel,public_channel'
      }).map(e => `${e[0]}=${encodeURIComponent(e[1])}`).join('&');

      const headers = new Headers();
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
