<template>
    <div>
        Cannot connect to Slack's API with the provided OAuth token.
    </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    msg: String
  }
}
</script>

<style scoped>
div {
    position: sticky;
    top: 0;
    border-radius: 3px;
    border: solid 1px #AF853B;
    background: #FCF0BA;
    margin: 10px 0 15px;
    padding: 15px 20px;
    box-shadow: 0 0 0 15px #FFF;
}
</style>
