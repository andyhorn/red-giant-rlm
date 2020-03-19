<template>
  <div class="mt-3">
    <h3>Launch new server</h3>
    <form @submit.prevent="launch" class="form">
      <div class="form-group">
        <label>Org Name</label>
        <input v-model="orgName" required class="form-control"/>
      </div>
      <div class="custom-file mb-2">
        <label class="custom-file-label">License Files</label>
        <input ref="fileList" type="file" required accept=".lic" multiple="true" class="custom-file-input"/>
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
    }
  },
  methods: {
    launch() {
      // Get the full path for each file selected
      let files = [...this.$refs.fileList.files].map(x => x.path);

      // Send the file paths and org name to the main Electron process
      ipcRenderer.send("createService", { orgName: this.orgName, files: files });

      // Clear the org name and file input
      this.orgName = "";
      this.$refs.fileList.files = null;
    }
  }
};
</script>

<style scoped>
</style>