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
    console.info('[WhatSlackStub]       fetchPrefs');
    return new Promise((resolve, reject) => {
      try{
        const data = JSON.parse(window.localStorage.getItem('prefs'));
        resolve(data ? data : {});
      } catch(err){
        reject(err);
      }
    });
  }

  persistPrefs(data) {
    console.info('[WhatSlackStub]       persistPrefs');
    return new Promise((resolve, reject) => {
      try{
        window.localStorage.setItem('prefs', JSON.stringify(data ? data : {}));
        console.info('[WhatSlackStub]       Persisted:', { prefs: data });
        resolve(data);
      } catch(err){
        reject(err);
      }
    });
  }

  fetchForwards() {
    console.info('[WhatSlackStub]       fetchForwards');
    return new Promise((resolve, reject) => {
      try{
        const data = JSON.parse(window.localStorage.getItem('forwards'));
        resolve(data ? data : []);
      } catch(err){
        reject(err);
      }
    });
  }

  persistForwards(data) {
    console.info('[WhatSlackStub]       persistForwards');
    return new Promise((resolve, reject) => {
      try{
        window.localStorage.setItem('forwards', JSON.stringify(data ? data : []));
        console.info('[WhatSlackStub]       Persisted:', { forwards: data });
        resolve(data);
      } catch(err){
        reject(err);
      }
    });
  }

  clearForwards() {
    return this.persistForwards([]);
  }

  fetchChats() {
    console.info('[WhatSlackStub]       fetchChats');
    return new Promise((resolve, reject) => {
      try{
        const data = JSON.parse(window.localStorage.getItem('chats'));
        resolve(data ? data : []);
      } catch(err){
        reject(err);
      }
    });
  }

  persistChats(data) {
    console.info('[WhatSlackStub]       persistChats');
    return new Promise((resolve, reject) => {
      try{
        window.localStorage.setItem('chats', JSON.stringify(data ? data : []));
        console.info('[WhatSlackStub]       Persisted:', { chats: data });
        resolve(data);
      } catch(err){
        reject(err);
      }
    });
  }

  clearChats() {
    return this.persistChats([]);
  }

  fetchContacts() {
    console.info('[WhatSlackStub]       fetchContacts');
    return new Promise((resolve, reject) => {
      try{
        const data = JSON.parse(window.localStorage.getItem('contacts'));
        resolve(data ? data : []);
      } catch(err){
        reject(err);
      }
    });
  }

  persistContacts(data) {
    console.info('[WhatSlackStub]       persistContacts');
    return new Promise((resolve, reject) => {
      try{
        window.localStorage.setItem('contacts', JSON.stringify(data ? data : []));
        console.info('[WhatSlackStub]       Persisted:', { contacts: data });
        resolve(data);
      } catch(err){
        reject(err);
      }
    });
  }

  clearContacts() {
    return this.persistContacts([]);
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
