<template>
  <transition name="slide">
    <div v-if="message">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppMessage',
  computed: {
    message() {
      switch(this.$store.getters.errors[0]) {
      case 'AUTH':
        return 'Verify your Slack authentication settings.';
      default:
        return false;
      }
    }
  }
};
</script>

<style scoped>
div {
    position: sticky;
    top: 0;
    margin: 10px 0 15px;
    padding: 15px 20px;
    border-radius: 3px;
    border: solid 1px #AF853B;
    background: #FCF0BA;
    box-shadow: 0 0 0 15px #FFF;
    overflow: hidden;
}

.slide-enter-active, .slide-leave-active {
  transition-duration: .25s;
  transition-timing-function: ease-in-out;
}

.slide-enter-to, .slide-leave {
  transform: scaleY(100%) translateY(0);
  height: auto;
  transform-origin: 50% 0;
}

.slide-enter, .slide-leave-to {
  transform: scaleY(0) translateY(-100px);
  height: 0;
  transform-origin: 50% 0;
}
</style>
