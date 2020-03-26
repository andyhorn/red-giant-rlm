<template>
    <table class="table">
        <Configuration :compose="compose" @openWebPort="openWebPort"/>
        <Docker :docker="docker" />
    </table>    
</template>

<script>
const { shell } = require('electron');
const Configuration = require('./Configuration').default;
const Docker = require('./Docker').default;

export default {
    name: 'status-table',
    props: ['compose', 'docker'],
    components: {
        Configuration,
        Docker
    },
    methods: {
        openWebPort() {
            let port = this.compose.ports[1].split(":")[0];
            shell.openExternal(`http://localhost:${port}`);
        }
    }
}
</script>

<style scoped>
.table {
    min-width: 100%;
}
</style>