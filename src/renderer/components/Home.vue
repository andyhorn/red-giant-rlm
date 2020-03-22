<template>
  <div class="container-fluid">
    <LaunchButton />
  </div>
</template>

<script>
const LaunchButton = require("@/components/Home/LaunchContainer").default;

export default {
  name: "Home",
  components: {
    LaunchButton
  }
};
</script>

<style scoped>

</style>