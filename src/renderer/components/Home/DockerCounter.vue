<template>
  <div class="d-flex flex-row">
    <h3>
      <span class="text-underline">{{ dockerInstances }}</span> RLM instances running.
    </h3>
    <button @click.prevent="scan">Refresh</button>
  </div>
</template>

<script>
const Docker = require("dockerode");

export default {
  name: "docker-counter",
  data() {
    return {
      dockerInstances: 0
    };
  },
  methods: {
    scan() {
      let docker = new Docker();
      docker.listContainers((err, containers) => {
        if (err) {
          console.log(err);
        } else {
          console.log(containers);
          this.dockerInstances = containers.length;
        }
      });
    }
  },
  mounted() {
    // scan for docker instances
    // scan();
  }
};
</script>

<style scoped>
.text-underline {
  text-decoration: underline;
}
</style>