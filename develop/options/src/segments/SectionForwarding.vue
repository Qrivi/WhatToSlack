<template>
  <section id="forwards">
    <h2>Forwarding Setup</h2>
    <p>
      Find an overview of and edit your forwarding rules below. You can also set up and edit forwarding rules directly from within WhatsApp Web, by opening the contact or group right side panel.
    </p>

    <div style="display: flex; justify-content: space-between">
      <TextSelect
        style="width: 49%"
        :icon="selectedIcon1"
        placeholder="Filter chats"
        :selected-item="selectedItem1"
        :suggested-items="suggestedItems1"
        @select="(item) => selectedItem1 = item"
      />

      <TextSelect
        style="width: 49%"
        :icon="selectedIcon2"
        placeholder="Filter channels"
        :selected-item="selectedItem2"
        :suggested-items="suggestedItems2"
        @select="(item) => selectedItem2 = item"
      />
    </div>
    <div style="display: flex; justify-content: space-between">
      <TextSelect
        style="width: 49%"
        :icon="selectedIcon1"
        placeholder="Filter chats"
        :selected-item="selectedItem1"
        :suggested-items="suggestedItems1"
        @select="(item) => selectedItem1 = item"
      />

      <TextSelect
        style="width: 49%"
        :icon="selectedIcon2"
        placeholder="Filter channels"
        :selected-item="selectedItem2"
        :suggested-items="suggestedItems2"
        @select="(item) => selectedItem2 = item"
      />
    </div>
  </section>
</template>

<script>
import TextSelect from '../components/TextSelect.vue';

export default {
  name: 'SectionForwarding',
  components: {
    TextSelect
  },
  data() {
    return {
      selectedIcon1: 'whatsapp',
      selectedItem1: { name: 'Select a conversation', key: 'Click to open' },
      suggestedItems1: [
        { name: 'Kristof Dewilde', key: '32494390870' },
        { name: 'Denzel Van Belle', key: '32494390871' },
        { name: 'Jeffrey Jefferson', key: '32492390871' },
        { name: 'Thomas van Stee', key: '32491390871' },
        { name: 'Wouter Versyck', key: '32493390871' },
        { name: 'Jan Pecquet', key: '32495390871' },
        { name: 'Wouter Anderewouter', key: '32474390871' },
        { name: 'Wout Shoovaerts', key: '32494690871' },
        { name: 'Woluwe Squad', key: '32494590871' }
      ],

      selectedIcon2: 'slack',
      selectedItem2: { name: 'Select a channel', key: 'Click to open' },
      suggestedItems2: [
        { name: '#random', key: 'C38329' },
        { name: '#dead', key: 'C38349' },
        { name: '#general', key: 'C12345' },
        { name: '#mivc', key: 'C38449' },
        { name: '#whatslack', key: 'C99999' }
      ]
    };
  }
};
</script>
