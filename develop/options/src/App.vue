<template>
  <div id="app">
    <AppMessage :status="status" />
    <SectionAuthentication />
    <SectionForwarding />
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
      status: ''
    };
  },
  created() {
    const core = chrome.storage ? new WhatSlackCore() : new WhatSlackStub();
    core.init(); // silently
    this.$store.commit('setCore', core);
  }
};
</script>

<style scoped>
section {
  position: relative;
  padding: 5px 0 20px;
  border-bottom: solid 1px #ccc;
}
</style>
