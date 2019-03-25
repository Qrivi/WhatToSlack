export default class WhatSlackRelay {
  #EP_POSTMESSAGE = {
    url: 'https://slack.com/api/chat.postMessage',
    type: 'application/json'
  };
  #EP_UPLOADFILE = {
    url: 'https://slack.com/api/files.upload',
    type: 'multipart/form-data'
  };

  constructor(token){
    this.token = token;
  }

  async handleMessage(model){
    console.info('[WhatSlackRelay]      handleMessage');
    if(!validateTokenFormat(this.token))
      throw new Error('Slack token is invalid.');
    // TODO implement
  }

  async handleFile(model){
    console.info('[WhatSlackRelay]      handleFile');
    if(!validateTokenFormat(this.token))
      throw new Error('Slack token is invalid.');
    // TODO implement
  }

  async postRequest(endpoint, content){
    headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);
    headers.append('Content-Type', endpoint.type);
    const body = endpoint.template ? { ...endpoint.template, content } : content;
    const call = await fetch(endpoint.url, { mode: 'no-cors', method: 'POST', headers, body });
    return await call.json();
  }

  validateTokenFormat(token) {
    if(!token)
      token = this.token;
    return /^xoxb-[0-9]{11}-[0-9]{12}-\w{24}$/.test(token);
  }
}
