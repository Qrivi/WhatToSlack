<template lang="pug">
    extends SectionBase.pug
    block content
        h3 Enable Object Logging
        input#log(type="checkbox")
        label(for="log") Output certain data objects to the console. Useful for debugging.
</template>

<script>
import SectionBase from './SectionBase.vue'

export default {
  name: 'SectionExtra',
  extends: SectionBase,
  props: {
  }
}
</script>

<style scoped>

</style>