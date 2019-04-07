<template>
  <div id="app">
    <AppMessage
      :status="status"
    />

    <SectionAuthentication
      ref="sectionAuthentication"
      @gotToken="verifyToken"
    />

    <SectionForwarding
      ref="sectionForwarding"
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
      status: ''
    };
  },
  created() {
    this.core = chrome.storage ? new WhatSlackCore() : new WhatSlackStub();
    this.core.fetchPrefs().then(prefs => {
      this.$refs.sectionAuthentication.validateToken(prefs && prefs.slackToken ? prefs.slackToken : '');
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
  padding: 5px 0 15px;
}
</style>
