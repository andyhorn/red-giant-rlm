<template>
  <table class="table">
    <thead>
      <tr>
        <th colspan="3">Configuration</th>
      </tr>
      <tr>
        <th>Service Name</th>
        <th>MAC Address</th>
        <th>Ports</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ compose.name }}</td>
        <td>{{ compose.mac_address }}</td>
        <td>
          <ul class="list-unstyled">
            <li v-for="(port, index) in compose.ports" :key="port">
              <div v-if="index == 1">
                <a href="#" @click="openWebPort">{{ port }}</a>
              </div>
              <div v-else>{{ port }}</div>
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const { shell } = require("electron");

export default {
  name: "configuration",
  props: ["compose"],
  methods: {
    openWebPort() {
      this.$emit("openWebPort");
    }
  }
};
</script>

<style scoped>
table {
    table-layout: fixed;
}
</style>