<template>
  <div class="mt-3">
    <h3>Launch new server</h3>
    <b-form>
      <b-form-group id="orgNameGroup" label="Customer name" label-for="orgName">
        <b-form-input id="orgName" v-model="orgName" placeholder="Customer name" class="mb-2"></b-form-input>
      </b-form-group>
      <b-form-group id="fileGroup" label="License files" label-for="licenseInput">
        <b-form-file
          id="licenseInput"
          v-model="files"
          :state="Boolean(files.length)"
          placeholder="Select files or drag and drop here"
          drop-placeholder="Drop files here"
          multiple
          accept=".lic"
        ></b-form-file>
      </b-form-group>
      <b-button variant="success" class="mt-2" @click="launch">Start!</b-button>
    </b-form>
    <div v-if="files.length" class="mt-4">
      <h5 class="m-0">Files:</h5>
      <ul class="list-unstyled">
        <li v-for="file in files" :key="file.name">{{ file.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
const IPC = require("../../../main/contracts/Ipc");

export default {
  name: "launch-container",
  data() {
    return {
      orgName: "",
      files: []
    };
  },
  methods: {
    launch() {
      // Get the full path for each file selected
      // let files = [...this.$refs.fileList.files].map(x => x.path);
      let files = this.files.map(x => x.path);

      let name = this.formatOrgName(this.orgName);

      // Send the file paths and org name to the main Electron process
      ipcRenderer.send(IPC.CREATE_SERVICE_REQUEST, {
        orgName: name,
        files: files
      });

      // Clear the org name and file input
      this.orgName = "";
      this.files = [];
      // this.$refs.fileList.files = null;
    },
    formatOrgName(orgName) {
      return orgName.replace(" ", "_");
    }
  }
};
</script>

<style scoped>
#licenseInput:hover {
  cursor: pointer;
}
</style>