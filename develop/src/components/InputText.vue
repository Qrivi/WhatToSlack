<template>
    <div>
        <h3>{{ title }}</h3>
        <input type="text" :placeholder="placeholder" v-model="value">
        <span :class="feedback.type">{{ feedback.text }}</span>
    </div>
</template>

<script>
export default {
  name: 'InputText',
  props: {
    title: String,
    placeholder: String,
    value: String,
    feedback: {
        text: String,
        type: String
    },
    validate: Function
  }
}
</script>

<style scoped lang="scss">
h3 {
    font-weight: 700;
    font-size: 1.1em;
    margin: 15px 0 0;
    color: inherit;
}

input {
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

span {
    font-size: .9em;
    margin: 0 0 20px;
    
    &.error {
        color: #ff3333;
    }
}
</style>