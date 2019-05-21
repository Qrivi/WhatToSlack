import Vue from 'vue';
import Vuex from 'vuex';

import WhatSlackCore from '../../../content/src/common/WhatSlackCore';
import WhatSlackStub from '../../../content/src/common/WhatSlackStub';

Vue.use(Vuex);

const core = chrome.storage ? new WhatSlackCore() : new WhatSlackStub();

export const store = new Vuex.Store({
  state: {
    errors: {},
    token: '',
    forwards: [],
    chats: [],
    channels: []
  },
  getters: {
    errors: state => state.errors,
    token: state => state.token,
    forwards: state => state.forwards,
    chats: state => state.chats,
    channels: state => state.channels,
  },
  mutations: {
    ERRORS (state, errors) {
      Vue.set(state, 'errors', errors);
    },
    PREFS (state, prefs) {
      core.prefs = prefs;
      Vue.set(state, 'token', prefs.slackToken);
    },
    FORWARDS (state, forwards) {
      Vue.set(state, 'forwards', forwards);
    },
    CHATS (state, chats) {
      Vue.set(state, 'chats', chats);
    },
    CHANNELS (state, channels) {
      Vue.set(state, 'channels', channels);
    }
  },
  actions: {
    async SYNC_TOKEN({ state, commit }, token) {
      try {
        const action = token ? core.persistPrefs : core.fetchPrefs;
        commit('PREFS', await action({ ...core.prefs, slackToken: token }));
        commit('ERRORS', { ...state.errors, prefs: false });
      }catch (err) {
        commit('ERRORS', { ...state.errors, prefs: err });
      }
    },
    async SYNC_FORWARDS({ state, commit }, forwards) {
      try {
        const action = forwards ? core.persistForwards : core.fetchForwards;
        commit('FORWARDS', await action(forwards));
        commit('ERRORS', { ...state.errors, forwards: false });
      } catch (err) {
        commit('ERRORS', { ...state.errors, forwards: err });
      }
    },
    async SYNC_CHATS({ state, commit }, chats) {
      try {
        const action = chats ? core.persistChats : core.fetchChats;
        commit('CHATS', await action(chats));
        commit('ERRORS', { ...state.errors, chats: false });
      } catch (err) {
        commit('ERRORS', { ...state.errors, chats: err });
      }
    },
    async CLEAR_CHATS(context) {
      return SYNC_CHATS(context, []);
    },
    async CLEAR_CONTACTS({ state, commit }) {
      try {
        await core.clearContacts();
        commit('ERRORS', { ...state.errors, contacts: false });
      } catch (err) {
        commit('ERRORS', { ...state.errors, contacts: err });
      }
    },
    async FETCH_CHANNELS({ state, commit }) {
      try {
        commit('CHANNELS', await core.fetchChannels());
        commit('ERRORS', { ...state.errors, channels: false });
      } catch (err) {
        commit('ERRORS', { ...state.errors, channels: err });
      }
    }
  }
});
