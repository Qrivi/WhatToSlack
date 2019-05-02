<template>
  <section id="forwards">
    <h2>Forwarding Rules</h2>
    <p>
      Find an overview of and edit your forwarding rules below. You can also set up and edit forwarding rules directly from within WhatsApp Web, by opening the contact or group right side panel.
    </p>

    <h3>Message forwarding</h3>
    <em v-if="forwards.length === 0">You have not set up any forwarding rules yet.</em>
    <ul v-if="forwards.length !== 0">
      <li v-for="forward in forwards" :key="`${forward.chatId}|${forward.channelId}`">
        <svg :class="{ button: !forward.editing }"><use href="../assets/icons.svg#remove" /></svg>
        <svg class="button" @click="toggleEditing(forward)">
          <use v-if="!forward.editing" href="../assets/icons.svg#edit" />
          <use v-else href="../assets/icons.svg#confirm" />
        </svg>
        <p v-if="!forward.editing">
          <span>
            <b :title="forward.chatId">{{ getChatName(forward.chatId) }}</b> will be forwarded to <b :title="forward.channelId">{{ getChannelName(forward.channelId) }}</b>.
          </span>
          <span :v-if="getError(forward)" :class="getError(forward)[0]">
            {{ getError(forward)[1] }}
          </span>
        </p>
        <div v-else>
          <TextSelect
            icon="whatsapp"
            placeholder="Filter chats"
            :selected-item="{ id: forward.chatId, name: getChatName(forward.chatId) }"
            :suggested-items="chats"
          />
          <TextSelect
            icon="slack"
            placeholder="Filter channels"
            :selected-item="{ id: forward.channelId, name: getChannelName(forward.channelId) }"
            :suggested-items="channels"
          />
        </div>
      </li>
    </ul>

    <a class="button" @click="addRule()">Add rule</a>
  </section>
</template>

<script>
import TextSelect from '../components/TextSelect.vue';

export default {
  name: 'SectionForwarding',
  components: {
    TextSelect
  },
  props: {

  },
  computed: {
    forwards() {
      return this.$store.getters.core ? this.$store.getters.core.forwards : [];
    },
    chats() {
      return this.$store.getters.core ? this.$store.getters.core.chats : [];
    },
    channels() {
      return this.$store.getters.core ? this.$store.getters.core.channels.map(c => ({
        id: c.id,
        name: `#${c.name}`
      })) : [];
    }
  },
  methods: {
    getChatName: function(chatId){
      const name = this.$store.getters.core.chats.find(c => c.id === chatId);
      return name ? name : chatId;
    },
    getChannelName: function(channelId){
      const name = this.$store.getters.core.channels.find(c => c.id === channelId);
      return name ? `#${name}` : channelId;
    },
    getError: function(forward) {
      if(forward.channelId === this.getChatName(forward.channelId))
        return ['error', 'WhatSlack does not have access to this channel anymore.'];
      return false;
    },
    toggleEditing(forward) {
      this.$set(forward, 'editing', !forward.editing);
    },
    addRule(){
      this.$store.getters.core.forwards.push({ editing: true    });
    }
  }
};
</script>

<style scoped lang="scss">
h3 {
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
  text-transform: uppercase;
  font-size: .8em;
  padding: 5px 10px;
}

em {
  display: block;
  padding: 10px;
}

ul {
  font-size: 1.1em;
  list-style: none;

  li {
    border-bottom: 1px solid #ddd;
    clear: both;
    min-height: 61px;
    padding: 10px;

    div {
      display: flex;

      /deep/ .contour {
        width: 100%;
        margin-right: 10px;
      }
    }

    p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 40px;

      span:nth-child(2) {
        font-size: .8em;
        color: #616161;

        &.warning {
          color: #9F6000;
        }

        &.error {
          color: #D8000C;
        }
      }
    }

    svg {
      float: right;
      width: 32px;
      height: 30px;
      border: 1px solid #bbb;
      border-radius: 4px;
      padding: 5px;
      margin-left: 5px;
      cursor: not-allowed;
      opacity: .5;
      transition: box-shadow .1s ease-in-out, opacity .1s ease-in-out;

      &.button {
        opacity: 1;
        cursor: pointer;

        :hover {
          box-shadow: 0 1px 4px 0 #ccc;
        }
      }
    }
  }
}
</style>
