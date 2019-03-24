<template>
  <div id="app">
    <AppMessage :status="status" />

    <section id="slack">
      <h2>Slack Authentication</h2>
      <p>
        WhatSlack requires a registered Slack bot to post forwarded WhatsApp messages to your team's workspace. If you have not done so yet, you will need to create a Slack app, add a bot and provide its authentication token below. <a href="https://github.com/Qrivi/">More info.</a>
      </p>

      <TextField
        title="Bot OAuth Access Token"
        placeholder="xoxb-..."
        :value="tokenValue"
        :maxlength="54"
        :feedback-status="tokenFeedbackStatus"
        :feedback-message="tokenFeedbackMessage"
        @input="validateToken"
      />
    </section>

    <AppFooter />
  </div>
</template>

<script>
import debounce from 'debounce';

import WhatSlackCore from '../../content/src/common/WhatSlackCore';
import WhatSlackStub from '../../content/src/common/WhatSlackStub';

import AppFooter from './components/AppFooter.vue';
import AppMessage from './components/AppMessage.vue';
import TextField from './components/TextField.vue';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppMessage,
    TextField
  },
  data() {
    return {
      core: null,
      status: '',
      tokenValue: '',
      tokenFeedbackStatus: '',
      tokenFeedbackMessage: ''
    };
  },
  created() {
    this.core = chrome.storage ? new WhatSlackCore() : new WhatSlackStub();
    this.core.fetchPrefs().then(prefs => {
      if(prefs.slackToken){
        this.tokenValue = prefs.slackToken;
        this.validateToken();
      }
    });
  },
  methods: {
    validateToken: debounce(function(e) {
      if(e && e.target)
        this.tokenValue = e.target.value;

      if(!this.tokenValue.length){
        this.tokenFeedbackStatus = 'warning';
        this.tokenFeedbackMessage = 'Can\'t do much without token ¯\\_(ツ)_/¯';
        return;
      }
      if(!/^[a-z]{4}-[0-9]{11}-[0-9]{12}-\w{24}$/.test(this.tokenValue)){
        this.tokenFeedbackStatus = 'error';
        this.tokenFeedbackMessage = 'This is not a valid Slack token';
        return;
      }
      if(!this.tokenValue.startsWith('xoxb')){
        this.tokenFeedbackStatus = 'error';
        this.tokenFeedbackMessage = 'This Slack token is not a bot token';
        return;
      }
      this.core.savePrefs({ slackToken: this.tokenValue })
        .then(() => {
          this.core.fetchChannels()
            .then(() => {
              this.status = '';
              this.tokenFeedbackStatus = 'ok';
              this.tokenFeedbackMessage = 'Token looks great — thanks!';
            })
            .catch(err => {
              this.status = err;
              this.tokenFeedbackStatus = 'warning';
              this.tokenFeedbackMessage = 'Token is well formatted but seems to be invalid';
            });
        });
    }, 1000)
  }
};
</script>
