const logger = require('./config/logger');
const db = require('./config/database');
const scheduler = require('./services/scheduler');
const whatsapp = require('./services/whatsapp');

function main() {
    logger.info('Application starting...');
    
    // Initialize WhatsApp client and its event listeners
    whatsapp.initialize();

    // Start the message sending scheduler once the client is ready
    whatsapp.client.on('ready', () => {
        scheduler.start();
    });
}

// Graceful Shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`Caught ${signal}. Shutting down gracefully...`);
    try {
        await whatsapp.client.destroy();
        logger.info('WhatsApp client destroyed.');
        await db.close();
    } catch (e) {
        logger.error('Error during graceful shutdown', e);
    } finally {
        process.exit(0);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

main();