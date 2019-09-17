module.exports = {
  apps: [{
    name: "app",
    script: "./runner.js",
    watch: ['./src', './server', './public', './build'],
    watch_ignore: ['./tests', './logs', './node_modules'],
  }]
}