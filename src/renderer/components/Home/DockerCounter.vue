<template>
  <div class="d-flex flex-column">
    <h3>
      <span class="text-underline">{{ dockerInstances }}</span> RLM instances running.
    </h3>
    <h3>
      <span class="text-underline">{{ composeServices }}</span> RLM instances desired.
    </h3>
    <button class="btn btn-primary" @click.prevent="scan">Refresh</button>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');

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
      ipcRenderer.send("dockerCountRequest");
    }
  },
  mounted() {
    // scan for docker instances
    this.scan();
    ipcRenderer.on("dockerCountResponse", (e, data) => {
      this.dockerInstances = data;
    })
  }
};
</script>

<style scoped>
.text-underline {
  text-decoration: underline;
}
</style>