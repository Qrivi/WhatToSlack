export default class WhatSlackRelay {
  EP_POSTMESSAGE = {
    url: 'https://slack.com/api/chat.postMessage',
    type: 'application/json; charset=utf-8',
    parser: JSON.stringify
    // template: {
    //   icon_emoji: ':robot_face:', // eslint-disable-line
    //   username: 'WhatsApp user'
    // }
  };
  EP_UPLOADFILE = {
    url: 'https://slack.com/api/files.upload',
    type: 'multipart/form-data'
  };

  QUOTE_ADD = [
    'Yay! Welcome!',
    'Great — even more spam now... Just kidding! :smile:',
    'Open WhatsApp and say hi, guys!',
    'Can\'t wait for the extra messages to process!',
    'Welcome! Your hair looks great, by the way!'
  ];
  QUOTE_REMOVE = [
    'Awww. I really liked processing their messages. :cry:',
    'If this goes on I\'ll be without a job soon! :cold_sweat',
    'Good riddance! :smiling_imp:',
    'Bye bye!',
    'Adios and vamos a la playa! (my developer is still working on my Spanish module)'
  ];

  constructor(prefs){
    this.token = prefs.slackToken;
  }

  async handleMessage(model){
    console.info('[WhatSlackRelay]      handleMessage');

    try{
      switch (model.type) {
      case 'message':
        return await this.postRequest(this.EP_POSTMESSAGE, {
          channel: model.channelId,
          text: model.message,
          username: model.from,
          icon_emoji: ':robot_face:' // eslint-disable-line
          // TODO add ws-photobook integration
        });
      case 'user_added':
        return await this.postRequest(this.EP_POSTMESSAGE, {
          channel: model.channelId,
          username: 'WhatSlack Stacy',
          attachments: [{
            mrkdwn_in: ['text', 'pretext'], // eslint-disable-line
            color: '#299389',
            pretext: this.getQuote('ADD'),
            text: `*${model.by}* added *${model.who}* to the group.`,
            fallback: `${model.by} added ${model.who} to the group.`,
          }]
        });
      case 'user_joined':
        return await this.postRequest(this.EP_POSTMESSAGE, {
          channel: model.channelId,
          username: 'WhatSlack Stacy',
          attachments: [{
            mrkdwn_in: ['text', 'pretext'], // eslint-disable-line
            color: '#299389',
            pretext: this.getQuote('ADD'),
            text: `*${model.who}* joined the group.`,
            fallback: `${model.who} joined the group.`,
          }]
        });
      case 'user_removed':
        return await this.postRequest(this.EP_POSTMESSAGE, {
          channel: model.channelId,
          username: 'WhatSlack Stacy',
          attachments: [{
            mrkdwn_in: ['text', 'pretext'], // eslint-disable-line
            color: 'warning',
            pretext: this.getQuote('REMOVE'),
            text: `*${model.by}* removed *${model.who}* from the group.`,
            fallback: `${model.by} removed ${model.who} from the group.`,
          }]
        });
      case 'user_left':
        return await this.postRequest(this.EP_POSTMESSAGE, {
          channel: model.channelId,
          username: 'WhatSlack Stacy',
          attachments: [{
            mrkdwn_in: ['text', 'pretext'], // eslint-disable-line
            color: 'warning',
            pretext: this.getQuote('REMOVE'),
            text: `*${model.who}* left the group.`,
            fallback: `${model.who} left the group.`,
          }]
        });
      }
    }catch(err){
      console.error('[WhatSlackRelay]     Whoopsies!', err); // TODO show in popup
    }
  }

  async handleFile(){
    console.info('[WhatSlackRelay]      handleFile');
    // TODO implement
  }

  postRequest(endpoint, payload){
    console.info('[WhatSlackRelay]    # Contacting Slack with data:', payload);
    return new Promise((resolve, reject) => {
      if(!this.validateTokenFormat(this.token))
        return reject('Please verify your Slack OAuth token.');

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${this.token}`);
      headers.append('Content-Type', endpoint.type);

      let body = endpoint.template ? { ...endpoint.template, ...payload } : payload;
      if(endpoint.parser)
        body = endpoint.parser(body);

      fetch(endpoint.url, { method: 'POST', headers, body })
        .then(response => response.json())
        .then(data => {
          if(data.ok)
            resolve(data.ts);
          else if(data.error === 'invalid_auth')
            reject('Cannot connect to Slack: the provided OAuth token is invalid.');
          else if(data.error === 'channel_not_found')
            reject('Configured Slack channel to forward to is no longer available.');
          else if(data.error === 'is_archived')
            reject('Configured Slack channel to forward to has been archived.');
          else if(data.error === 'msg_too_long')
            reject('The message is too long to forward to Slack.');
          else if(data.error === 'no_text')
            reject('The message appears to be empty so was not forwarded to Slack.');
          else
            reject(`Slack API returned an error: ${data.error}.`);
        })
        .catch(err => reject(err));
    });
  }

  getQuote(action){
    const quotes = this[`QUOTE_${action.toUpperCase()}`];
    if(!quotes || !quotes.length)
      return 'I don\'t know what to say!';
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  validateTokenFormat(token) {
    if(!token)
      token = this.token;
    return /^xoxb-[0-9]{11}-[0-9]{12}-\w{24}$/.test(token);
  }
}
