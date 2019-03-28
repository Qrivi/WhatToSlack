export default class WhatSlackRelay {
  EP_POSTMESSAGE = {
    url: 'https://slack.com/api/chat.postMessage',
    type: 'application/json; charset=utf-8',
    parser: JSON.stringify,
    template: {
      icon_emoji: ':robot_face:', // eslint-disable-line
      username: 'WhatsApp user'
    }
  };
  EP_UPLOADFILE = {
    url: 'https://slack.com/api/files.upload',
    type: 'multipart/form-data'
  };

  constructor(prefs){
    this.token = prefs.slackToken;
    // TODO this.validateTokenFormat(this.token) and throw error if nok
  }

  async handleMessage(model){
    console.info('[WhatSlackRelay]      handleMessage');
    try{
      switch (model.type) {
      case 'message':
        return await this.postRequest(this.EP_POSTMESSAGE, {
          channel: model.channelId,
          text: model.message,
          username: model.from
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

  validateTokenFormat(token) {
    if(!token)
      token = this.token;
    return /^xoxb-[0-9]{11}-[0-9]{12}-\w{24}$/.test(token);
  }
}
