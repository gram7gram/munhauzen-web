module.exports = {
  apps: [{
    name: "app",
    script: "./runner.js",
    watch: ['./src', './server', './public'],
    watch_ignore: ['./tests', './build', './env', './node_modules'],
  }]
}