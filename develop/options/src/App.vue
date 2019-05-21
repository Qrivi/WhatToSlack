<template>
  <div id="app">
    <AppMessage />
    <SectionAuthentication />
    <SectionForwarding />
    <AppFooter />
  </div>
</template>

<script>
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
