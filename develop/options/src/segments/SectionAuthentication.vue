<template>
  <section id="slack">
    <h2>Slack Authentication</h2>
    <p>
      WhatSlack requires a registered Slack bot to post forwarded WhatsApp messages to your team's workspace. If you have not done so yet, you will need to create a Slack app, add a bot and provide its authentication token below. <a href="https://github.com/Qrivi/">More info.</a>
    </p>

    <TextField
      ref="inputToken"
      title="Bot OAuth Access Token"
      placeholder="xoxb-..."
      :maxlength="54"
      :feedback-type="feedbackType"
      :feedback-message="feedbackMessage"
      @value="validateToken"
    />
  </section>
</template>

<script>
import debounce from 'debounce';

import TextField from '../components/TextField.vue';

export default {
  name: 'SectionAuthentication',
  components: {
    TextField
  },
  data() {
    return {
      feedbackType: '',
      feedbackMessage: ''
    };
  },
  methods: {
    setFeedback: function(type, message) {
      this.feedbackType = type ? type : '';
      this.feedbackMessage = message ? message : '';
    },
    setToken: function(token){
      this.$refs.inputToken.input(token);
    },
    validateToken: debounce(function(token) {
      if(!token || !token.length){
        this.feedbackType = 'warning';
        this.feedbackMessage = 'Can\'t do much without token ¯\\_(ツ)_/¯';
        return;
      }
      if(!/^[a-z]{4}-[0-9]{11}-[0-9]{12}-\w{24}$/.test(token)){
        this.feedbackType = 'error';
        this.feedbackMessage = 'This is not a valid Slack token';
        return;
      }
      if(!token.startsWith('xoxb')){
        this.feedbackType = 'error';
        this.feedbackMessage = 'This Slack token is not a bot token';
        return;
      }
      this.$emit('validToken', token);
    }, 1000)
  }
};
</script>
