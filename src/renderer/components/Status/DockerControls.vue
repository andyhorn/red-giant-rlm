<template>
    <div class="d-flex flex-row justify-content-between">
        <div class="d-flex flex-row justify-content-between">
            <button @click="restart" class="btn btn-success mx-1">Start/Restart</button>
            <button @click="stop" class="btn btn-danger mx-1">Stop</button>
        </div>
        <div>
            <button @click="remove" class="btn btn-block btn-danger mx-1">Remove</button>
        </div>
    </div>    
</template>

<script>
const { ipcRenderer } = require('electron')
const IPC = require('../../../main/contracts/Ipc')

export default {
  name: 'docker-controls',
  props: ['name'],
  methods: {
    restart () {
      ipcRenderer.send(IPC.START_DOCKER_REQUEST, this.name)
    },
    stop () {
      ipcRenderer.send(IPC.STOP_DOCKER_REQUEST, { isName: true, name: this.name })
    },
    remove () {
      ipcRenderer.send(IPC.REMOVE_SERVICE_REQUEST, this.name)
      this.$router.push({name: 'home-page'})
    }
  }
}
</script>

<style scoped>

</style>