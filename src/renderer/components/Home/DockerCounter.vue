<template>
  <div class="d-flex flex-column border rounded p-2">
    <div class="d-flex flex-row justify-content-around">
      <div class="text-center">
        <h3>Running:</h3>
        <h4>{{ dockerInstances }}</h4>
      </div>

      <div class="text-center">
        <h3>Configured:</h3>
        <h4>
          <ul class="list-unstyled d-flex flex-row flex-wrap justify-content-around">
            <li v-for="service in composeServices" :key="service" class="mx-2">
              <router-link :to="{ name: 'service-status', query: { name: service }}">{{ service }}</router-link>
            </li>
          </ul>
        </h4>
      </div>

    </div>
    <button class="btn btn-primary" @click.prevent="scan">Refresh</button>
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
    })
  }
};
</script>

<style scoped>
.text-underline {
  text-decoration: underline;
}
</style>