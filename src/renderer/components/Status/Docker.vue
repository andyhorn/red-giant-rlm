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
        <div class="my-2">
            <button @click="restart" class="btn btn-success">Start/Restart</button>
            <button @click="stop" class="btn btn-danger">Stop</button>
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
        }
    }
}
</script>

<style scoped>

</style>