<template>
  <div class="container-fluid">
    <h1 class="text-center">Red Giant RLM Manager</h1>
    <DockerCounter />
    <LaunchButton />
  </div>
</template>

<script>
const DockerCounter = require("@/components/Home/DockerCounter").default;
const LaunchButton = require("@/components/Home/LaunchContainer").default;

export default {
  name: "Home",
  components: {
    DockerCounter,
    LaunchButton
  }
};
</script>

<style scoped>
</style>