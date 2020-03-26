export default class Service {
  constructor () {
    this.name = ''
    this.container_name = ''
    this.ports = []
    this.hostname = ''
    this.mac_address = ''
    this.build = {
      context: '',
      dockerfile: '',
      args: []
    }
    this.healthcheck = {
      test: [],
      interval: '',
      timeout: '',
      retries: null
    }
    this.restart = ''
  }

  getIsvPort () {
    if (this.ports.length === 3) {
      return this.ports[2].split(':')[0]
    }

    return null
  }

  toString () {
    let rawData = {
      container_name: this.container_name,
      ports: this.ports.map(p => String(p)),
      hostname: this.hostname,
      mac_address: this.mac_address,
      build: {
        context: this.build.context,
        dockerfile: this.build.dockerfile,
        args: this.build.args
      },
      healthcheck: {
        test: this.healthcheck.test,
        interval: this.healthcheck.interval,
        timeout: this.healthcheck.timeout,
        retries: this.healthcheck.retries
      },
      restart: this.restart
    }

    return rawData
  }
}
