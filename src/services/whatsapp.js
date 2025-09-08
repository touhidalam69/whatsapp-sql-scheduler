const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const logger = require('../config/logger');
const op = require('../db/operation');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: process.env.PUPPETEER_HEADLESS !== 'false',
    },
});

function initialize() {
    logger.info('Initializing WhatsApp client...');

    client.on('loading_screen', (percent, message) => {
        logger.info(`LOADING SCREEN: ${percent}% ${message}`);
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        logger.info('QR Code received, please scan.');
    });

    client.on('authenticated', () => {
        logger.info('Client authenticated successfully.');
    });

    client.on('auth_failure', (msg) => {
        logger.error('Authentication failed.', { message: msg });
    });

    client.on('ready', async () => {
        logger.info('WhatsApp client is ready!');
        const debugWWebVersion = await client.getWWebVersion();
        logger.info(`WWebVersion = ${debugWWebVersion}`);
    });

    client.on('message', async (msg) => {
        try {
            const chat = await msg.getChat();
            const user = await msg.getContact();
            const body = msg.body.replace(/[^\w\s.,!?-]/g, '');
            
            const replyMessage = process.env.DEFAULT_REPLY_MESSAGE || 'Thank you for your message.';
            await chat.sendMessage(replyMessage);

            await op.logIncomingMessage(user.id.user, body);
        } catch (error) {
            logger.error('Failed to process incoming message:', error);
        }
    });

    client.on('disconnected', (reason) => {
        logger.warn('Client was logged out.', { reason });
    });

    client.initialize();
}

module.exports = { client, initialize };
