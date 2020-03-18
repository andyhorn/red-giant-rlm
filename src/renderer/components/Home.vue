<template>
  <div class="container-fluid">
    <h1>Red Giant RLM Manager</h1>
    <DockerCounter />
    <LaunchButton />
  </div>
</template>

<script>
const DockerCounter = require("@/components/Home/DockerCounter").default;
const LaunchButton = require("@/components/Home/LaunchContainer").default;
const path = require("path");
const fs = require("fs");
const ComposeParser = require("../helpers/ComposeParser").default;

export default {
  name: "Home",
  components: {
    DockerCounter,
    LaunchButton
  },
  data() {
    return {
      rlmDirPath: path.join("C:", "RLM"),
      assetsPath: path.join("src", "renderer", "assets"),
      licensesDirPath: null,
      composeFileAsset: null,
      composeFile: null,
      dockerFileAsset: null,
      dockerfile: null,
      entrypointAsset: null,
      entrypointScript: null
    };
  },
  beforeMount() {
    this.licensesDirPath = path.join(this.rlmDirPath, "Licenses");
    this.composeFileAsset = path.resolve(
      this.assetsPath,
      "rlm",
      "docker-compose.yml"
    );
    this.composeFile = path.join(this.rlmDirPath, "docker-compose.yml");
    this.dockerFileAsset = path.resolve(this.assetsPath, "rlm", "Dockerfile");
    this.dockerfile = path.join(this.rlmDirPath, "Dockerfile");
    this.entrypointAsset = path.resolve(
      this.assetsPath,
      "rlm",
      "entrypoint.sh"
    );
    this.entrypointScript = path.join(this.rlmDirPath, "entrypoint.sh");
  },
  mounted() {
    this.checkFiles();
    this.readCompose();
  },
  methods: {
    checkFiles() {
      console.log("checking RLM directory");
      this.makeDirIfMissing(this.rlmDirPath);

      console.log("checking licenses directory");
      this.makeDirIfMissing(this.licensesDirPath);

      console.log("Checking docker-compose file");
      this.copyFileIfMissing(this.composeFileAsset, this.composeFile);

      console.log("checking Dockerfile");
      this.copyFileIfMissing(this.dockerFileAsset, this.dockerfile);

      console.log("checking entrypoint script");
      this.copyFileIfMissing(this.entrypointAsset, this.entrypointScript);
    },
    makeDirIfMissing(dirPath) {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    },
    copyFileIfMissing(copyFrom, copyTo) {
      if (!fs.existsSync(copyTo)) {
        fs.copyFileSync(copyFrom, copyTo);
      }
    },
    readCompose() {
      let fileData = fs.readFileSync(this.composeFile, "utf-8");
      console.log(fileData);
      let services = ComposeParser(fileData);
      console.log(services);
    }
  }
};
</script>

<style scoped>
</style>