
const cid = (len = 5) => Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, len);

export default cid