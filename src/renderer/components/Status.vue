<template>
    <div class="container-fluid">
        <router-link :to="{ path: 'home-page' }">Back</router-link>
        <a href="#" @click="getStatus">Refresh</a>
        <Configuration v-if="showConfig" :data="composeData" />
        <Docker v-if="showDocker" :data="dockerData" :name="composeData.name" />
    </div>    
</template>

<script>
const { ipcRenderer } = require('electron');
const IPC = require('../../main/contracts/Ipc');
const Configuration = require('./Status/Configuration').default;
const Docker = require('./Status/Docker').default;

export default {
    name: "service-status",
    components: {
        Configuration,
        Docker
    },
    data() {
        return {
            name: "",
            dockerData: null,
            composeData: null,
            showConfig: false,
            showDocker: false      
        }
    },
    methods: {
        getStatus() {
            ipcRenderer.send(IPC.SERVICE_STATUS_REQUEST, this.name);
        },
    },
    mounted() {
        this.name = this.$route.query.name;
        let vm = this;
        ipcRenderer.on(IPC.SERVICE_STATUS_RESPONSE, (e, data) => {
            console.log(data);
            vm.dockerData = data.dockerData || null;
            vm.composeData = data.composeData || null;

            vm.showConfig = true;
            vm.showDocker = true;
        });

        ipcRenderer.on(IPC.START_DOCKER_RESPONSE, () => {
            vm.getStatus();
        });
        ipcRenderer.on(IPC.STOP_DOCKER_RESPONSE, () => {
            vm.getStatus();
        });

        this.getStatus();
    }
}
</script>

<style scoped>

</style>