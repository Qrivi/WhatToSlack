<template>
  <section id="forwards">
    <h2>Forwarding Setup</h2>
    <p>
      Find an overview of and edit your forwarding rules below. You can also set up and edit forwarding rules directly from within WhatsApp Web, by opening the contact or group right side panel.
    </p>

    <EntryForward
      v-if="forwards.length === 0"
      :chats="chats"
      :channels="channels"
    />

    <EntryForward
      v-for="forward in forwards"
      :key="`${forward.chatId}|${forward.channelId}`"
      :chats="chats"
      :channels="channels"
      :forward="forward"
    />

    <!-- TODO add buttons to remove and add -->
  </section>
</template>

<script>
import EntryForward from '../components/EntryForward.vue';

export default {
  name: 'SectionForwarding',
  components: {
    EntryForward
  },
  props: {
    chats: Array,
    channels: Array,
    forwards: Array
  }
};
</script>

<style scoped lang="scss">

</style>
