export default class WhatSlackListener {
  constructor(loaderData) {
    this.forwards = loaderData.forwards ? loaderData.forwards : [];
    this.chats = loaderData.chats ? loaderData.chats : [];
    this.channels = loaderData.channels ? loaderData.channels : [];
    this.contacts = loaderData.contacts ? loaderData.contacts : [];
  }

  start() {
    console.info('[WhatSlackListener]   start');
    if(this.LISTENER_TOKEN)
      clearInterval(this.LISTENER_TOKEN);
    this.LISTENER_TOKEN = setInterval(() => this.ping(), 10);
  }

  ping() {
    if(window.Store && this.forwards.length !== 0)
      Store.Msg.models.forEach(model => {
        if(model.isNewMsg) {
          model.isNewMsg = false;
          const forward = this.forwards.find(f => f.chatId === model.chat.id.user);

          if(forward) {
            window.postMessage({
              action: 'HANDLE_MESSAGE',
              content: { ...this.cleanModel(model), ...forward }
            });
          }
        }
      });
  }

  cleanModel(model) {
    if(model.senderObj)
      this.updateContacts(model.senderObj.id.user, model.senderObj.displayName);

    if(model.text)
      return {
        type: 'message',
        fromId: model.senderObj.id.user,
        from: this.getContact(model.senderObj.id.user),
        message: this.parseMentions(model.text)
      };
    if(model.eventType === 'i' && model.subtype === 'add')
      return {
        type: 'user_added', // by someone else in the group
        who: model.recipients.map(r => this.getContact(r.user)),
        by: this.getContact(model.senderObj.id.user)
      };
    if(model.eventType === 'i' && model.subtype === 'invite')
      return {
        type: 'user_joined', // by invitation link
        who: model.recipients.map(r => this.getContact(r.user))
      };
    if(model.eventType === 'i' && model.subtype === 'remove')
      return {
        type: 'user_removed', // by someone else in the group
        who: model.recipients.map(r => this.getContact(r.user)),
        by: this.getContact(model.senderObj.id.user)
      };
    if(model.eventType === 'i' && model.subtype === 'leave')
      return {
        type: 'user_left', // removed theirselves from the group
        who: model.recipients.map(r => this.getContact(r.user))
      };

    return { type: 'unknown' };
  }

  getContact(id){
    const contact = this.contacts.find(c => c.id === id);

    if(contact)
      return contact.name;
    return `+${id}`;
  }

  parseMentions(message){
    return message.replace(/@\d{1,15}/, m => this.getContact(m.substr(1)));
  }

  async updateContacts(id, name) {
    const index = this.contacts.map(c => c.id).indexOf(id);

    if(index === -1)
      this.contacts.push({ id, name });
    else if(this.contacts[index].name !== name)
      this.contacts[ index ] = { id, name };
    else
      return false;

    window.postMessage({
      action: 'SYNC_CONTACTS',
      content: this.contacts
    });

    console.info(`[WhatSlackListener] # ${id} is now known as ${name}`);
    return true;
  }

  async updateChats() {
    if(Store && Store.Msg && Store.Msg.models) {
      Store.Msg.models.forEach(model => {
        const index = this.chats.map(c => c.id).indexOf(model.chat.id.user);
        const value = {
          id: model.chat.id.user,
          name: model.chat.name
        };

        if(index === -1)
          this.chats.push(value);
        else
          this.chats[ index ] = value;
      });

      window.postMessage({
        action: 'SYNC_CHATS',
        content: this.chats
      });
      return true;
    }
    throw new Error('No chats found');
  }

  async updateForward(chatId, channelId) {
    const index = this.forwards.map(f => f.chatId).indexOf(chatId);

    if(index === -1)
      this.forwards.push({ chatId, channelId });
    else if(this.forwards[index].channelId !== channelId)
      this.forwards[ index ] = { chatId, channelId };
    else
      return false;

    window.postMessage({
      action: 'SYNC_FORWARDS',
      content: this.forwards
    });
    return true;
  }
}
