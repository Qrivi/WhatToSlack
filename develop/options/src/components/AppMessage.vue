<template>
  <transition name="slide">
    <div v-if="status">
      {{ status }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppMessage',
  props: {
    status: String
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
}

.slide-enter-to {
  animation: slide-in .33s;
}
.slide-leave-to {
  animation: slide-in .33s reverse;
}

@keyframes slide-in {
  0% {
    height: 0;
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
  }
  33% {
    opacity: 0
  }
  100% {
    height: 52px;
    margin-top: 10px;
    margin-bottom: 15px;
    padding-top: 15px;
    padding-bottom: 15px;
    opacity: 1;
  }
}
</style>
