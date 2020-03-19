<template>
    <div>
        <h1>{{ name }}</h1>
    </div>    
</template>

<script>
const { ipcRenderer } = require('electron');
const IPC = require('../../main/contracts/Ipc');

export default {
    name: "service-status",
    data() {
        return {
            name: "",
            dockerData: {},
            composeData: {}
        }
    },
    mounted() {
        this.name = this.$route.query.name;
        ipcRenderer.send(IPC.SERVICE_STATUS_REQUEST, this.name);
        ipcRenderer.on(IPC.SERVICE_STATUS_RESPONSE, (e, data) => {
            this.dockerData = data.dockerData;
            this.composeData = data.composeData;
        })
    }
}
</script>

<style scoped>

</style>