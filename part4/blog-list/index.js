const app = require('./app') // Nhập module app
const config = require('./utils/config') // Nhập module config
const logger = require('./utils/logger') // Nhập module logger


app.listen(config.PORT, () => { // Khởi động server với PORT từ config
  logger.info(`Server running on port ${config.PORT}`) // In ra thông báo khi server chạy
})