module.exports = {
  apps: [{
    name: "app",
    script: "./src/runner.js",
    watch: ['./src'],
    watch_ignore: ['./logs', './node_modules', './tests'],
  }]
}