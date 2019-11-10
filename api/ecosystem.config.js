module.exports = {
  apps: [{
    name: "app",
    script: "./src/runner.js",
    watch: ['./src', './parameters.js'],
    watch_ignore: ['./logs', './node_modules', './tests'],
  }]
}