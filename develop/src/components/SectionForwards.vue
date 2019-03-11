<template lang="pug">
    extends SectionBase.pug
    block content
        ul
            li 
                div 
                    h3 WhatsApp Chat
                div 
                    h3 Slack Channel
</template>

<script>
import SectionBase from './SectionBase.vue'

export default {
  name: 'SectionForwards',
  extends: SectionBase,
  props: {
  }
}
</script>

<style scoped>

</style>