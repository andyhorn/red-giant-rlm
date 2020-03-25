<template>
  <div class="mt-3">
    <h3>Launch new server</h3>
    <b-form>
      <b-form-group id="orgNameGroup" label="Customer name" label-for="orgName">
        <b-form-input
          id="orgName"
          required
          v-model="orgName"
          placeholder="Customer name"
          class="mb-2"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="fileGroup" label="License files" label-for="licenseInput">
        <b-form-file
          id="licenseInput"
          v-model="files"
          placeholder="Select files or drag and drop here"
          drop-placeholder="Drop files here"
          multiple
          accept=".lic"
          v-b-hover="hover"
          :class="{ 'hover': hovering }"
          required
          :file-name-formatter="fileNameFormatter"
        ></b-form-file>
      </b-form-group>
      <b-button variant="success" class="mt-2" @click="launch">Start!</b-button>
    </b-form>
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
      files: [],
      hovering: false
    };
  },
  methods: {
    launch() {
      // Get the full path for each file selected
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
    },
    formatOrgName(orgName) {
      return orgName.replace(" ", "_");
    },
    hover(isHovering) {
      this.hovering = isHovering;
    },
    fileNameFormatter(files) {
      if (files.length == 1) {
        return files[0].name;
      } else {
        return `${files[0].name} + ${files.length - 1} more`;
      }
    }
  }
};
</script>

<style scoped>
.hover {
  box-shadow: 0px 0px 5px 1px green !important;
}
</style>