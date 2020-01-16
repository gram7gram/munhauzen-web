module.exports = {
  apps: [{
    name: "app",
    script: "./runner.js",
    watch: ['./server'],
    watch_ignore: ['./node_modules', './public'],
  }]
}