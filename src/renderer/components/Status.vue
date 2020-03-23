<template>
  <div class="container-fluid" v-if="showConfig && showDocker">
    <div class="m-0 p-1 border-bottom d-flex flex-row justify-content-between">
      <div>
        <router-link :to="{ path: 'home-page' }">Back</router-link>|
        <a href="#" @click="getStatus">Refresh</a>
      </div>
      <a href="#" @click="generateLicense">Generate Client License</a>
    </div>
    <StatusTable :compose="composeData" :docker="dockerData" v-if="showConfig && showDocker" />
    <DockerControls :name="name" />
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
const IPC = require("../../main/contracts/Ipc");
const StatusTable = require("./Status/StatusTable").default;
const DockerControls = require("./Status/DockerControls").default;

export default {
  name: "service-status",
  components: {
    StatusTable,
    DockerControls
  },
  data() {
    return {
      name: "",
      dockerData: null,
      composeData: null,
      showConfig: false,
      showDocker: false,
      initialized: false
    };
  },
  watch: {
	  name() {
		  this.getStatus();
	  }
  },
  methods: {
    getStatus() {
      console.log("Getting stats");
      ipcRenderer.send(IPC.SERVICE_STATUS_REQUEST, this.name);
    },
    generateLicense() {
      let port = this.composeData.ports[0].split(":")[0];
      ipcRenderer.send(IPC.CLIENT_LICENSE_REQUEST, port);
    },
    initServiceResponseHandler() {
      let vm = this;
      ipcRenderer.on(IPC.SERVICE_STATUS_RESPONSE, (e, data) => {
        vm.dockerData = data.dockerData || null;
        vm.composeData = data.composeData || null;

        vm.showConfig = true;
        vm.showDocker = true;
      });
    },
    initDockerResponseHandlers() {
      let vm = this;
      ipcRenderer.on(IPC.START_DOCKER_RESPONSE, () => {
        vm.getStatus();
      });
      ipcRenderer.on(IPC.STOP_DOCKER_RESPONSE, () => {
        vm.getStatus();
      });
	},
	getName() {
		if (this.name == "") {
			this.name = this.$route.query.name;
		}
	}
  },
  beforeRouteUpdate(to, from, next) {
	  const name = to.query.name;
	  this.name = name;
	  next();
  },
  mounted() {
	this.getName();
	this.initDockerResponseHandlers();
	this.initServiceResponseHandler();
  }
};
</script>

<style scoped>
</style>