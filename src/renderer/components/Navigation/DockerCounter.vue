<template>
  <div id="container" class="d-flex flex-column justify-content-between">
    <div>
      <div class="border-bottom">
        <p class="m-0 p-1"><strong>Running:</strong> 
          <router-link :to="{name: 'docker-instances'}">{{ dockerInstances }}</router-link></p>
      </div>

      <div class="mt-2">
        <p class="m-0 p-1"><strong>Configured</strong></p>
        <ul class="list-unstyled pl-1">
          <li 
            v-for="service in composeServices"
            :key="service"
            >
            <router-link :to="{ name: 'service-status', query: { name: service }}">
              {{ service }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <button class="btn btn-secondary" @click.prevent="scan">Refresh</button>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');
const IPC = require('../../../main/contracts/Ipc');

export default {
  name: "docker-counter",
  data() {
    return {
      dockerInstances: 0,
      composeServices: 0
    };
  },
  methods: {
    scan() {
      ipcRenderer.send(IPC.DOCKER_COUNT_REQUEST);
      ipcRenderer.send(IPC.SERVICE_NAMES_REQUEST);
      ipcRenderer.send(IPC.DOCKER_SERVICES_REQUEST);
    }
  },
  mounted() {
    // scan for docker instances
    this.scan();
    ipcRenderer.on(IPC.DOCKER_COUNT_RESPONSE, (e, data) => {
      console.log(`Received "${data}" number of containers`);
      this.dockerInstances = data;
    });
    ipcRenderer.on(IPC.SERVICE_NAMES_RESPONSE, (e, data) => {
      this.composeServices = data;
    });
    ipcRenderer.on(IPC.STOP_DOCKER_RESPONSE, () => {
      this.scan();
    });
    ipcRenderer.on(IPC.START_DOCKER_RESPONSE, () => {
      this.scan();
    });
    ipcRenderer.on(IPC.REMOVE_SERVICE_RESPONSE, () => {
      this.scan();
    });
    ipcRenderer.on(IPC.CREATE_SERVICE_RESPONSE, () => {
      this.scan();
    });
  }
};
</script>

<style scoped>
.text-underline {
  text-decoration: underline;
}
#container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  padding: 5px;
}
</style>