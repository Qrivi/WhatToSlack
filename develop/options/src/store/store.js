import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    core: null,
    errors: []
  },
  mutations: {
    SET_CORE (state, core) {
      state.core = core;
    },
    ADD_ERROR (state, key) {
      if (!state.errors.includes(key))
        state.errors = [...state.errors, key];
    },
    CLEAR_ERROR (state, key) {
      state.errors = state.errors.filter(e => e !== key);
    }
  },
  getters: {
    core: state => state.core,
    errors: state => state.errors
  }
});
