<template>
    <div>
        <h3>Docker Container</h3>
        <div v-if="data">
            <table class="table">
                <tr>
                    <th>Service name</th>
                    <td>{{ name }}</td>
                </tr>
                <tr>
                    <th>Container name</th>
                    <td>{{ data.Image }}</td>
                </tr>
                <tr>
                    <th>State</th>
                    <td>{{ data.State }}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>{{ data.Status }}</td>
                </tr>
            </table>
        </div>
        <div v-else>
            <p>Container not running.</p>
        </div>
        <div class="d-flex flex-row justify-content-between mb-3">
            <div class="d-flex flex-row justify-content-left">
                <button @click="restart" class="btn btn-success mx-1">Start/Restart</button>
                <button @click="stop" class="btn btn-danger mx-1">Stop</button>
            </div>
            <div class="px-2">
                <button @click="remove" class="btn btn-block btn-danger mx-1">Remove</button>
            </div>
        </div>
        
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
const IPC = require('../../../main/contracts/Ipc');

export default {
    name: 'docker-status',
    props: ['data', 'name'],
    methods: {
        restart() {
            ipcRenderer.send(IPC.START_DOCKER_REQUEST, this.name);
        },
        stop() {
            ipcRenderer.send(IPC.STOP_DOCKER_REQUEST, this.name);
        },
        remove() {
            ipcRenderer.send(IPC.REMOVE_SERVICE_REQUEST, this.name);
            this.$route.push({name: 'home-page'});
        }
    }
}
</script>

<style scoped>

</style>