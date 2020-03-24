<template>
  <div id="app">
    <LeftNavigation />
    <div id="body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
const LeftNavigation = require('@/components/LeftNavigation').default;

export default {
  name: "red-giant-rlm",
  components: {
    LeftNavigation
  }
};
</script>

<style>

#body {
  padding: 5px;
  padding-left: 200px;
}
</style>
