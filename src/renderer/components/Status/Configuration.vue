<template>
  <div>
    <h3>Configuration</h3>
    <table class="table">
        <tr>
            <th>Name</th>
            <td>{{ data.name }}</td>
        </tr>
        <tr>
            <th>MAC Address</th>
            <td>{{ data.mac_address }}</td>
        </tr>
        <tr>
            <th>Ports</th>
            <td>
                <ul class="list-unstyled">
                    <li v-for="port in data.ports" :key="port">
                        {{ port }}
                    </li>
                </ul>
            </td>
        </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "configuration-status",
  props: ["data"]
};
</script>

<style scoped>
</style>