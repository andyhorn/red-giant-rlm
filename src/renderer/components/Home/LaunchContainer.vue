<template>
  <div class="mt-3">
    <form @submit.prevent="launch" class="form">
      <div class="form-group">
        <label>Org Name</label>
        <input v-model="orgName" class="form-control"/>
      </div>
      <div class="custom-file mb-2">
        <label class="custom-file-label">License Files</label>
        <input type="file" class="custom-file-input"/>
      </div>
      <input class="btn btn-primary" type="submit" value="Start!" />
    </form>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
  name: "launch-container",
  data() {
    return {
      orgName: ""
    };
  },
  methods: {
    launch() {
      ipcRenderer.send("createService", {orgName: this.orgName, files: []});
    }
  }
};
</script>

<style scoped>
</style>