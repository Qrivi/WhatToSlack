<template lang="pug">
    include SectionBase.pug
</template>

<script>
export default {
  name: 'SectionBase',
  props: {
    title: String,
    description: String
  }
}
</script>

<style scoped lang="scss">
section {
    padding: 5px 0 20px;
    border-bottom: solid 1px #ccc;
}

input[type="text"] {
    display: block;
    width: 100%;
    margin: 8px 0 4px !important;
    padding: 8px 12px !important;
    font: inherit !important;
    font-size: 1.1em !important;
    border-radius: 3px !important;
    color: inherit !important;
    background: #fff;
    outline: solid 1px #616061 !important;
    outline: none !important;
    transition: box-shadow .1s !important;
    
    &:focus{
        box-shadow: 0 0 0 4px #C8E0F0;
    }
}

span.feedback {
    font-size: .9em;
    margin: 0 0 20px;
}
</style>