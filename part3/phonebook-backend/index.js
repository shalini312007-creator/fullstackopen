
const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')

    const server = app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`)
    })

    const shutdown = () => {
      server.close(async () => {
        await mongoose.connection.close()
        logger.info('Server shut down')
        process.exit(0)
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  })
  .catch((error) => {
    logger.error('Could not connect to MongoDB:', error.message)
    process.exit(1)
  })
