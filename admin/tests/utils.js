const cid = (length = 5) => Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, length);

module.exports = {
  cid
}
