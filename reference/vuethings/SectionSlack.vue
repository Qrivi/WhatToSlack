<template lang="pug">
    extends SectionBase.pug
    block content
        h3 Bot OAuth Access Token
        input(type="text" placeholder="xoxb-...")
        span.error Not a valid bot token
</template>

<script>
import SectionBase from './SectionBase.vue'

export default {
  name: 'SectionSlack',
  extends: SectionBase,
  props: {
  }
}
</script>

<style scoped>

</style>
