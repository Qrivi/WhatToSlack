<template>
  <transition name="slide">
    <div v-if="messages.length">
      <p v-for="(message, index) in messages" :key="`msg-${index}`">
        {{ message }}
      </p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppMessage',
  computed: {
    messages() {
      const errors = this.$store.getters.errors;
      const msgs = [];
      Object.keys(errors).forEach(e => {
        if(errors[e])
          msgs.push(errors[e]);
      });
      return msgs;
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
