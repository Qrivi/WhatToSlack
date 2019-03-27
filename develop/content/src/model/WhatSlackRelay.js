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
  }

  async handleMessage(model){
    console.info('[WhatSlackRelay]      handleMessage');
    if(!this.validateTokenFormat(this.token))
      throw new Error('Slack token is invalid.');

    switch (model.type) {
    case 'message':
      return await this.postRequest(this.EP_POSTMESSAGE, {
        channel: model.channelId,
        text: model.message,
        username: model.from
      });
    }

    // TODO error handling
  }

  async handleFile(model){ // eslint-disable-line
    console.info('[WhatSlackRelay]      handleFile');
    if(!this.validateTokenFormat(this.token))
      throw new Error('Slack token is invalid.');
    // TODO implement
  }

  async postRequest(endpoint, data){
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);
    headers.append('Content-Type', endpoint.type);

    console.info('[WhatSlackRelay]    # Contacting Slack with data:', data);
    let body = endpoint.template ? { ...endpoint.template, ...data } : data;
    if(endpoint.parser)
      body = endpoint.parser(body);

    const call = await fetch(endpoint.url, { method: 'POST', headers, body });
    return await call.json();
  }

  validateTokenFormat(token) {
    if(!token)
      token = this.token;
    console.log(token);
    return /^xoxb-[0-9]{11}-[0-9]{12}-\w{24}$/.test(token);
  }
}
