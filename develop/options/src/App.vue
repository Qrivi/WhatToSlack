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

    <section id="forwards">
      <h2>Forwarding Setup</h2>
      <p>
        Find an overview of and edit your forwarding rules below. You can also set up and edit forwarding rules directly from within WhatsApp Web, by opening the contact or group right side panel.
      </p>

      <div style="display: flex; justify-content: space-between">
        <TextSelect
          style="width: 49%"
          :icon="selectedIcon1"
          placeholder="Filter chats"
          :selected-item="selectedItem1"
          :suggested-items="suggestedItems1"
          @select="(item) => selectedItem1 = item"
        />

        <TextSelect
          style="width: 49%"
          :icon="selectedIcon2"
          placeholder="Filter channels"
          :selected-item="selectedItem2"
          :suggested-items="suggestedItems2"
          @select="(item) => selectedItem2 = item"
        />
      </div>
      <div style="display: flex; justify-content: space-between">
        <TextSelect
          style="width: 49%"
          :icon="selectedIcon1"
          placeholder="Filter chats"
          :selected-item="selectedItem1"
          :suggested-items="suggestedItems1"
          @select="(item) => selectedItem1 = item"
        />

        <TextSelect
          style="width: 49%"
          :icon="selectedIcon2"
          placeholder="Filter channels"
          :selected-item="selectedItem2"
          :suggested-items="suggestedItems2"
          @select="(item) => selectedItem2 = item"
        />
      </div>
    </section>
    <AppFooter />
  </div>
</template>

<script>
import debounce from 'debounce';

import WhatSlackCore from '../../content/src/common/WhatSlackCore';
import WhatSlackStub from '../../content/src/common/WhatSlackStub';

import AppFooter from './parts/AppFooter.vue';
import AppMessage from './parts/AppMessage.vue';
import TextField from './components/TextField.vue';
import TextSelect from './components/TextSelect.vue';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppMessage,
    TextField,
    TextSelect
  },
  data() {
    return {
      core: null,
      status: '',
      tokenValue: '',
      tokenFeedbackStatus: '',
      tokenFeedbackMessage: '',

      selectedIcon1: 'whatsapp',
      selectedItem1: { name: 'Select a conversation', key: 'Click to open' },
      suggestedItems1: [
        { name: 'Kristof Dewilde', key: '32494390870' },
        { name: 'Denzel Van Belle', key: '32494390871' },
        { name: 'Jeffrey Jefferson', key: '32492390871' },
        { name: 'Thomas van Stee', key: '32491390871' },
        { name: 'Wouter Versyck', key: '32493390871' },
        { name: 'Jan Pecquet', key: '32495390871' },
        { name: 'Wouter Anderewouter', key: '32474390871' },
        { name: 'Wout Shoovaerts', key: '32494690871' },
        { name: 'Woluwe Squad', key: '32494590871' }
      ],

      selectedIcon2: 'slack',
      selectedItem2: { name: 'Select a channel', key: 'Click to open' },
      suggestedItems2: [
        { name: '#random', key: 'C38329' },
        { name: '#dead', key: 'C38349' },
        { name: '#general', key: 'C12345' },
        { name: '#mivc', key: 'C38449' },
        { name: '#whatslack', key: 'C99999' }
      ]
    };
  },
  created() {
    this.core = chrome.storage ? new WhatSlackCore() : new WhatSlackStub();
    this.core.fetchPrefs().then(prefs => {
      if(prefs && prefs.slackToken){
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
            .catch(err =>  {
              if(err.toString().endsWith('Failed to fetch'))
                err = chrome.storage
                  ? 'Could not verify token. This is not OK — you should check with a developer.'
                  : 'Fetch failed. If this happened because of CORS on localhost, this is normal.';
              this.status = err.toString();
              this.tokenFeedbackStatus = 'warning';
              this.tokenFeedbackMessage = 'Token is well formatted but seems to be invalid';
            });
        });
    }, 1000)
  }
};
</script>

<style scoped>
section {
    padding: 5px 0 20px;
}
</style>
