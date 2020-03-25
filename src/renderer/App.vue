<template>
  <div id="app">
    <LeftNavigation />
    <div id="body">
      <BusyModal :show="showBusyModal" />
      <router-view @showModal="showModal"></router-view>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-vue/dist/bootstrap-vue.css';
const LeftNavigation = require('@/components/LeftNavigation').default;
const BusyModal = require('@/components/BusyModal').default;
const { ipcRenderer } = require('electron');
const IPC = require('../main/contracts/Ipc');

export default {
  name: "red-giant-rlm",
  components: {
    LeftNavigation,
    BusyModal
  },
  data() {
    return {
      showBusyModal: false
    }
  },
  mounted() {
    ipcRenderer.on(IPC.SHOW_MODAL_EVENT, () => {
      this.showModal();
    })
    ipcRenderer.on(IPC.HIDE_MODAL_EVENT, () => {
      this.hideModal();
    });
  },
  methods: {
    showModal() {
      this.showBusyModal = true;
    },
    hideModal() {
      this.showBusyModal = false;
    }
  }
};
</script>

<style>
#body {
  padding: 5px;
  padding-left: 200px;
}
</style>
