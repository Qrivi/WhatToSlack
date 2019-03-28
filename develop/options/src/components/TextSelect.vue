<template>
  <div
    v-click-outside="() => {showSuggestions = false}"
    class="contour"
    @click="toggleSuggestions()"
  >
    <img :src="require(`@/assets/icn_${icon}.png`)">
    <span>{{ selectedItem.name }}</span>
    <span>{{ selectedItem.key }}</span>
    <transition name="slide">
      <div
        v-if="showSuggestions"
        class="suggestions"
      >
        <input
          ref="search"
          v-model="search"
          type="search"
          :placeholder="placeholder"
          @click.stop
          @keyup="e => e.key === 'Enter' ? selectItem() : null"
        >
        <ul>
          <li
            v-for="item in filteredItems"
            :key="item.key"
            @click="$emit('select', item)"
          >
            <span>{{ item.name }}</span>
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  name: 'TextSelect',
  directives: {
    ClickOutside
  },
  props: {
    icon: String,
    placeholder: String,
    selectedItem: Object,
    suggestedItems: Array
  },
  data() {
    return {
      showSuggestions: false,
      search: '',
    };
  },
  computed: {
    filteredItems() {
      return this.suggestedItems
        .filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()) || item.key.toLowerCase().includes(this.search.toLowerCase()))
        .sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.key > b.key) ? 1 : -1) : -1);
    }
  },
  mounted () {
    this.popupItem = this.$el;
  },
  methods: {
    toggleSuggestions: function(){
      this.showSuggestions = !this.showSuggestions;
      this.$nextTick(() => {
        if(this.showSuggestions)
          this.$refs.search.focus();
      });
    },
    selectItem: function(item){
      if(!this.filteredItems.length)
        return;

      if(!item)
        item = this.filteredItems[0];

      this.showSuggestions = false;
      this.$emit('select', item);
    }
  }
};
</script>

<style scoped lang="scss">
.contour{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  height: 62px;
  margin: 8px 0 4px;
  padding: 10px 10px 10px 60px;
  background: #fff;
  border: solid 1px #616061;
  border-radius: 3px;
  margin: 8px 0 4px !important;
  overflow: visible;
  cursor: pointer;

  &:after{
    position: absolute;
    top: 18px;
    right: 22px;
    font-size: 1.4em;
    content: "▾";
  }

  img{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    padding: 12px;
  }

  span{
    font-size: .9em;

    &:first-of-type{
      font-weight: 700;
      font-size: 1.1em;
    }
  }

  .suggestions{
    position: absolute;
    z-index: 999;
    top: 58px;
    left: -1px;
    width: calc(100% + 2px);
    border: solid 1px #616061;
    border-top: none;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    background: #fff;
    overflow: hidden;

    input { // overwrite Chrome style styles
      display: block;
      width: calc(100% - 22px);
      margin: 5px auto 10px !important;
      padding: 8px 12px !important;
      font: inherit !important;
      font-size: 1.1em !important;
      border-radius: 3px !important;
      color: inherit !important;
      background: #fff;
      outline: none !important;
      transition: box-shadow .1s !important;

      &:focus{
          box-shadow: 0 0 0 4px #C8E0F0;
      }
    }

    ul{
      list-style: none;
      max-height: 180px;
      overflow: scroll;

      li{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 100%;
        padding: 10px 10px 10px 60px;
        background: #fff;

        &:hover{
          background: #32629E;

          > span {
            color: #fff;
          }
        }
      }
    }
  }
}

.slide-enter-active, .slide-leave-active {
  transition-duration: .25s;
  transition-timing-function: ease-in-out;
}

.slide-enter-to, .slide-leave {
  transform: scaleY(100%) translateY(0);
  transform-origin: 50% 0;
}

.slide-enter, .slide-leave-to {
  transform: scaleY(0) translateY(-100px);
  transform-origin: 50% 0;
}
</style>
