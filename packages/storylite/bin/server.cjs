const path = require('path')
const { createServer } = require('vite')
// const path = require('path')

// parse cmd options
const options = (() => {
  const args = process.argv.slice(2)
  const options = {}
  args.forEach(arg => {
    const [key, value] = arg.split('=')
    options[key.replace('--', '')] = value
  })

  return options
})()

// get --port argument from command line options
const serverPort = options.port || 7707

let storyliteServer

const rootDir = path.resolve(__dirname, '..')

async function startServer() {
  // const storyliteConfigFileBase = path.resolve(process.cwd(), 'storylite.config')
  // const storyliteConfigFile =
  //   ['.js', '.ts', '.cjs', '.mjs']
  //     .map(ext => storyliteConfigFileBase + ext)
  //     .find(file => fs.existsSync(file)) || storyliteConfigFileBase + '.ts'

  console.log('CWD is', process.cwd())
  console.log('Root dir is', rootDir)
  storyliteServer = await createServer({
    // Vite server options here
    root: rootDir, // Set the root directory of your project
    server: {
      port: serverPort, // Port for the server to listen on
    },
  })

  await storyliteServer.listen()
  console.log(
    '🧪 StoryLite server is running at:',
    'http://localhost:' + storyliteServer.config.server.port,
  )
}

async function stopServer() {
  if (storyliteServer) {
    console.log('Stopping StoryLite server...')
    await storyliteServer.close()
    console.log('StoryLite server has been stopped.')
  }
}

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Stopping server...')
  await stopServer()
  process.exit(0)
})

startServer().catch(error => {
  console.error('Error starting StoryLite server:', error)
})
