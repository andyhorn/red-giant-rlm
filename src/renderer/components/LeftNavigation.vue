<template>
    <div id="wrapper" class="bg-light">
        <DockerCounter />
    </div>
</template>

<script>
const DockerCounter = require('@/components/Navigation/DockerCounter').default

export default {
  name: 'left-navigation',
  components: {
    DockerCounter
  }
}
</script>

<style scoped>
#wrapper {
  min-height: 100vh;
  width: 200px;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid silver;
  z-index: 100;
  overflow-x: hidden;
}
</style>