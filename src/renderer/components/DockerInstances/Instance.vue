<template>
    <tr>
        <td>{{ container.Created }}</td>
        <td>{{ container.Id}}</td>
        <td>{{ container.Image }}</td>
        <td>{{ container.State }}</td>
        <td>{{ container.Status }}</td>
        <td class="text-center">
            <button @click="stop(container.Id)" class="btn btn-outline-danger btn-sm">Stop</button>
        </td>
    </tr>
</template>

<script>
const { ipcRenderer } = require('electron')
const IPC = require('../../../main/contracts/Ipc')

export default {
  name: 'instance',
  props: ['container'],
  methods: {
    stop (id) {
      ipcRenderer.send(IPC.STOP_DOCKER_REQUEST, { isName: false, id: id })
    }
  }
}
</script>

<style scoped>
td {
    overflow: hidden;
    max-width: 200px;
}
</style>