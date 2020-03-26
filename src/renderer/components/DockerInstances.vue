<template>
    <div class="container-fluid">
        <div class="m-0 ml-2 p-1 border-bottom">
            <router-link :to="{name: 'home-page'}">Back</router-link>
        </div>
        <table class="table">
            <thead>
                <th>Created</th>
                <th width="100px">ID</th>
                <th>Image</th>
                <th>State</th>
                <th>Status</th>
                <th class="text-center">Actions</th>
            </thead>
            <tbody>
                <Instance
                    v-for="container in containers"
                    :key="container.Id"
                    :container="container"
                ></Instance>
            </tbody>
        </table>
    </div>    
</template>

<script>
const IPC = require('../../main/contracts/Ipc')
const { ipcRenderer } = require('electron')
const Instance = require('@/components/DockerInstances/Instance').default

export default {
  name: 'docker-instances',
  components: {
    Instance
  },
  data () {
    return {
      containers: []
    }
  },
  mounted () {
    this.getContainers()

    let vm = this
    ipcRenderer.on(IPC.DOCKER_SERVICES_RESPONSE, (e, containers) => {
      vm.containers = containers
    })
    ipcRenderer.on(IPC.STOP_DOCKER_RESPONSE, () => {
      vm.getContainers()
    })
  },
  methods: {
    getContainers () {
      ipcRenderer.send(IPC.DOCKER_SERVICES_REQUEST)
    }
  }
}
</script>

<style scoped>
.table {
    table-layout: auto;
    width: 100%;
}
</style>