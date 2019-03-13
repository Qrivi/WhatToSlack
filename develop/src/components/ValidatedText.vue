<template>
    <div>
        <h3 v-if="title">{{ title }}</h3>
        <input v-model="value" :placeholder="placeholder">
        <span :class="feedbackStatus">{{feedbackMessage}}</span>
    </div>
</template>

<script>
export default {
    name: 'ValidatedText',
    props: {
        title: String,
        placeholder: String,
        value: String,
        rules: {
            type: Object,
            default: () => ( {
                allowEmpty: { value: false },
                minLength: { value: 0 },
                maxLength: { value: 0 },
                pattern: { value: null },
                okMessage: ''
            } )
        }
    },
    data: function() {
        return { ...this.rules };
    },
    computed: {
        feedbackMessage: function() {
            if( this.allowEmpty.value && ( !this.value || !this.value.length ) )
                return this.allowEmpty.message ? this.allowEmpty.message : 'This field is required';
            if( this.minLength.value && this.value.length < this.minLength.value )
                return this.minLength.message ? this.minLength.message : `Value must at least be ${this.minLength.value} characters long`;
            if( this.maxLength.value && this.value.length > this.maxLength.value )
                return this.maxLength.message ? this.maxLength.message : `Value cannot be over ${this.minLength.value} characters long`;
            if( this.pattern.value && !this.pattern.value.test( this.value ) )
                return this.pattern.message ? this.pattern.message : 'Value is not correctly formatted';
            
            return this.okMessage.length ? this.okMessage : ' ';
        },
        feedbackStatus: function() {
            return 'ok';
            //return this.feedbackMessage === ' ' || this.feedbackMessage === this.okMessage ? 'ok' : 'error';
        }
    },
    methods: {
        validate(){
            
        }
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

input { // overwrite Chrome style styles
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