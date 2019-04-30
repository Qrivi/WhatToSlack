import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    core: null
  },
  mutations: {
    setCore (state, core) {
      state.core = core;
    }
  },
  getters: {
    core: state => state.core
  }
});
