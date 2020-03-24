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
          <li v-for="service in composeServices" :key="service">
            <a href="#" @click="open(service)">{{ service }}</a>
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
    open(name) {
      this.$router.push({name: 'service-status', query: {name: name}});
    },
    scan() {
      ipcRenderer.send(IPC.DOCKER_COUNT_REQUEST);
      ipcRenderer.send(IPC.SERVICE_NAMES_REQUEST);
      ipcRenderer.send(IPC.DOCKER_SERVICES_REQUEST);
    },
    setupListeners() {
      // Handle the docker count event
      ipcRenderer.on(IPC.DOCKER_COUNT_RESPONSE, (e, data) => {
        this.dockerInstances = data;
      });

      // Handle the compose service names event
      ipcRenderer.on(IPC.SERVICE_NAMES_RESPONSE, (e, data) => {
        this.composeServices = data;
      });

      // Handle the docker stop event
      ipcRenderer.on(IPC.STOP_DOCKER_RESPONSE, () => {
        this.scan();
      });

      // Handle the docker start event
      ipcRenderer.on(IPC.START_DOCKER_RESPONSE, () => {
        this.scan();
      });

      // Handle the remove service event
      ipcRenderer.on(IPC.REMOVE_SERVICE_RESPONSE, () => {
        this.scan();
      });

      // Handle the create service event
      ipcRenderer.on(IPC.CREATE_SERVICE_RESPONSE, () => {
        this.scan();
      });
    }
  },
  mounted() {
    // Initialize the event handlers
    this.setupListeners();

    // Scan for docker instances
    this.scan();
    setInterval(this.scan, 10 * 1000);
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