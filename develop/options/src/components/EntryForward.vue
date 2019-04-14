<template>
  <article>
    <TextSelect
      icon="whatsapp"
      placeholder="Filter chats"
      :selected-item="formattedChat"
      :suggested-items="formattedChats"
      @select="(item) => changeChat(item)"
    />

    <TextSelect
      icon="slack"
      placeholder="Filter channels"
      :selected-item="formattedChannel"
      :suggested-items="formattedChannels"
      @select="(item) => changeChannel(item)"
    />

    <a
      class="button"
      @click="removeForward()"
    >
      <img src="../assets/icn_trash.png">
    </a>
  </article>
</template>

<script>
import TextSelect from './TextSelect.vue';

export default {
  name: 'EntryForward',
  components: {
    TextSelect
  },
  props: {
    removable: Boolean,
    status: String,
    chats: Array,
    channels: Array,
    forward: Object
  },
  computed: {
    formattedChats() {
      return this.chats.map(c => ({
        key: c.id,
        name: c.name
      }));
    },
    formattedChannels() {
      return this.channels.map(c => ({
        key: c.id,
        name: `#${c.name}`
      }));
    },
    formattedChat() {
      if(this.forward && this.forward.chatId) {
        const chat = this.chats.find(c => c.id === this.forward.chatId);
        return { name: chat ? chat.name : 'Unknown conversation', key: forward.chatId };
      }
      return { name: 'Select a conversation', key: 'Click to open' };
    },
    formattedChannel() {
      if(this.forward && this.forward.channelId) {
        const channel = this.channels.find(c => c.id === this.forward.channelId);
        return { name: channel ? `#${c.channel}` : 'Inaccessible channel', key: forward.channelId };
      }
      return { name: 'Select a channel', key: 'Click to open' };
    }
  },
  methods: {
    changeChat: function(item) {
      this.$emit('update', {
        oldForward: this.forward,
        newForward: { chatId: item.key, channelId: this.forward.channelId }
      });
    },
    changeChannel: function(item) {
      this.$emit('update', {
        oldForward: this.forward,
        newForward: { chatId: this.forward.chatId, channelId: item.key }
      });
    },
    removeForward: function() {
      return this.$emit('remove', this.forward);
    }
  }
};
</script>

<style scoped lang="scss">
article {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px #ddd;
  border-radius: 6px;
  margin: 15px 0 5px;
  padding: 8px 20px;
  transition: border-color .1s, box-shadow .1s;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: #ddd;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    content: " ";
  }

  &.warning:before {
    background: #9F6000;
  }

  &.error:before {
    background: #D8000C;
  }

  &.removable {
    &:hover {
      border-color: #1d9bd1;
      box-shadow: 0 0 5px 0 #C8E0F0;
    }

    .button {
      width: 16px;
      margin-left: 10px;
    }
  }

  .button {
    overflow: hidden;
    width: 0;
    margin-left: 0;
    transition: margin-left .25s .5s, width .25s .5s;
    cursor: pointer;

    img{
      width: 100%;
    }
  }

  div.contour {
    width: 45%;
    margin: 0 10px;
  }
}
</style>
