<template>
  <div id="app">
    <AppMessage
      :status="status"
    />

    <SectionAuthentication
      ref="sectionAuthentication"
      @validToken="verifyToken"
    />

    <SectionForwarding
      ref="sectionForwarding"
      :chats="chats"
      :channels="channels"
      :forwards="forwards"
    />

    <AppFooter />
  </div>
</template>

<script>
import WhatSlackCore from '../../content/src/common/WhatSlackCore';
import WhatSlackStub from '../../content/src/common/WhatSlackStub';

import AppMessage from './segments/AppMessage.vue';
import AppFooter from './segments/AppFooter.vue';
import SectionAuthentication from './segments/SectionAuthentication.vue';
import SectionForwarding from './segments/SectionForwarding.vue';

export default {
  name: 'App',
  components: {
    AppMessage,
    AppFooter,
    SectionAuthentication,
    SectionForwarding
  },
  data() {
    return {
      core: null,
      status: '',
      chats: [],
      channels: [],
      forwards: []
    };
  },
  created() {
    this.core = chrome.storage ? new WhatSlackCore() : new WhatSlackStub();

    this.core.fetchPrefs().then(prefs => {
      const token = prefs && prefs.slackToken ? prefs.slackToken : '';
      this.$refs.sectionAuthentication.setToken(token);
    });

    this.core.fetchForwards().then(forwards => {
      if(forwards)
        this.forwards = forwards;
    });

    this.core.fetchChats().then(chats => {
      if(chats)
        this.chats = chats;
    });
  },
  methods: {
    verifyToken: function(token) {
      this.core.savePrefs({ slackToken: token })
        .then(() => {
          this.core.fetchChannels()
            .then(channels => {
              this.status = '';
              this.$refs.sectionAuthentication.setFeedback('ok', 'Token looks great — thanks!');
              this.channels = channels;
            })
            .catch(err =>  {
              if(err.toString().endsWith('Failed to fetch'))
                err = 'Could not verify token. This is not OK — you should check with a developer.';
              this.status = err.toString();
              this.$refs.sectionAuthentication.setFeedback('warning', 'Token is well formatted but seems to be invalid');
            });
        });
    }
  }
};
</script>

<style scoped>
section {
  padding: 5px 0 20px;
  border-bottom: solid 1px #ccc;
}
</style>
