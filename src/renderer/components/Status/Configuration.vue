<template>
  <div>
    <h3>Configuration</h3>
    <table class="table">
        <tr>
            <th>Name</th>
            <td>{{ data.name }}</td>
        </tr>
        <tr>
            <th>MAC Address</th>
            <td>{{ data.mac_address }}</td>
        </tr>
        <tr>
            <th>Ports</th>
            <td>
                <ul class="list-unstyled">
                    <li v-for="(port, index) in data.ports" :key="port">
                        <div v-if="index == 1">
                            <a href="#" @click="openWeb">{{ port }}</a>
                        </div>
                        <div v-else>
                            {{ port }}
                        </div>
                    </li>
                </ul>
            </td>
        </tr>
    </table>
  </div>
</template>

<script>
const { shell } = require('electron');

export default {
  name: "configuration-status",
  props: ["data"],
  methods: {
      openWeb() {
          let port = this.data.ports[1].split(":")[0];
          shell.openExternal(`http://localhost:${port}`);
      }
  }
};
</script>

<style scoped>
</style>