<template>
  <div id="app">
    <AppMessage :status="status" />

    <SectionAuthentication
      ref="sectionAuthentication"
      @gotToken="verifyToken"
    />

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
import WhatSlackCore from '../../content/src/common/WhatSlackCore';
import WhatSlackStub from '../../content/src/common/WhatSlackStub';

import AppFooter from './segments/AppFooter.vue';
import AppMessage from './segments/AppMessage.vue';
import SectionAuthentication from './segments/SectionAuthentication.vue';
import TextSelect from './components/TextSelect.vue';

export default {
  name: 'App',
  components: {
    AppFooter,
    AppMessage,
    SectionAuthentication,
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
      if(prefs && prefs.slackToken)
        this.$refs.sectionAuthentication.validateToken(prefs.slackToken);
    });
  },
  methods: {
    verifyToken: function(token) {
      this.core.savePrefs({ slackToken: token })
        .then(() => {
          this.core.fetchChannels()
            .then(() => {
              this.status = '';
              this.$refs.sectionAuthentication.setFeedback('ok', 'Token looks great — thanks!');
            })
            .catch(err =>  {
              if(err.toString().endsWith('Failed to fetch'))
                err = chrome.storage
                  ? 'Could not verify token. This is not OK — you should check with a developer.'
                  : 'Fetch failed. If this happened because of CORS on localhost, this is normal.';
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
}
</style>
