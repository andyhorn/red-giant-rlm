<template>
  <div>
    <form @submit.prevent="launch">
      <div class="form-group">
        <label>Org Name</label>
        <input v-model="orgName" />
      </div>
      <div class="form-group">
        <label>License Files</label>
        <input type="file" />
      </div>
      <input type="submit" value="Start!" />
    </form>
  </div>
</template>

<script>
const Docker = require("dockerode");
const path = require('path');
const yaml = require('yaml');

export default {
  name: "launch-container",
  data() {
    return {
      orgName: ""
    };
  },
  methods: {
    launch() {
      
    }
  }
};
</script>

<style scoped>
</style>