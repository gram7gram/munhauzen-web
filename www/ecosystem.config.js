module.exports = {
  apps: [{
    name: "app",
    script: "./runner.js",
    watch: ['./server', './parameters.js'],
    watch_ignore: ['./node_modules', './public'],
  }]
}