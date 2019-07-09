module.exports = {
  api: process.env.TARGET === 'production' ? 'http://paperapi.mindynode.com' : 'http://localhost:3000'
}
