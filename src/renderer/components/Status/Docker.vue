<template>
  <table class="table">
    <thead>
      <tr>
        <th colspan="3">Docker Container</th>
      </tr>
      <tr>
        <th>Name</th>
        <th>State</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ docker.Image }}</td>
        <td>{{ docker.State }}</td>
        <td>{{ docker.Status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "docker-status",
  props: ["docker", "name"]
};
</script>

<style scoped>
table {
    table-layout: fixed;
}
</style>