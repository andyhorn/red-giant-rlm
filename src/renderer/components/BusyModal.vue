<template>
    <b-modal 
        ref="modal" 
        centered
        no-close-on-backdrop
        no-close-on-esc
        hide-header
        hide-footer
        ok-disabled
        cancel-disabled
    >
        <div class="text-center d-flex flex-row align-items-center justify-content-center">
            <p class="m-0 p-0 mr-2">Working</p>
            <b-icon icon="gear" class="h1 m-0 p-0 ml-2" animation="spin"></b-icon>
        </div>
    </b-modal>
</template>

<script>
const { ipcRenderer } = require('electron');
const IPC = require('../../main/contracts/Ipc');
const MODAL_TIMEOUT = 3 * 60 * 1000;

export default {
    name: 'busy-modal',
    methods: {
        showModal() {
            this.$refs.modal.show();
            setTimeout(this.$refs.modal.hide, MODAL_TIMEOUT);
        },
        hideModal() {
            this.$refs.modal.hide();
        }
    },
    mounted() {
        let vm = this;
        ipcRenderer.on(IPC.SHOW_MODAL_EVENT, () => {
            vm.showModal();
        });
        ipcRenderer.on(IPC.HIDE_MODAL_EVENT, () => {
            vm.hideModal();
        })
    }
}
</script>

<style scoped>

</style>