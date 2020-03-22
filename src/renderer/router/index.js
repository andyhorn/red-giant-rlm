import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: require('@/components/Home').default
    },
    {
      path: 'service',
      name: 'service-status',
      component: require('@/components/Status').default
    },
    {
      path: 'docker',
      name: 'docker-instances',
      component: require('@/components/DockerInstances').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
