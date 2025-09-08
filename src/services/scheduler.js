const mime = require('mime-types');
const { MessageMedia } = require('whatsapp-web.js');
const logger = require('../config/logger');
const op = require('../db/operation');
const { client } = require('./whatsapp');

async function processSingleMessage(item) {
    try {
        const isRegistered = await client.isRegisteredUser(item.WhatsappNo);
        if (isRegistered) {
            const number_details = await client.getNumberId(item.WhatsappNo);
            let messageSent = false;

            if (item.Attachment && item.FileName) {
                const mimetype = mime.lookup(item.FileName);
                if (mimetype) {
                    const media = new MessageMedia(mimetype, item.Attachment, item.FileName);
                    await client.sendMessage(number_details._serialized, media);
                    messageSent = true;
                } else {
                    logger.warn(`Could not determine MIME type for ${item.FileName}. Attachment skipped.`, { ScheduleId: item.ScheduleId });
                }
            }

            if (item.MessageText) {
                await client.sendMessage(number_details._serialized, item.MessageText);
                messageSent = true;
            }

            if (messageSent) {
                await op.updateDeliveryStatus(item.ScheduleId, op.MESSAGE_STATUS.SUCCESS, 'Successful');
                logger.info(`Successfully sent message ScheduleId: ${item.ScheduleId}`);
            }

        } else {
            await op.updateDeliveryStatus(item.ScheduleId, op.MESSAGE_STATUS.FAILED_NOT_REGISTERED, 'Not registered on WhatsApp');
            logger.warn(`Message failed. Recipient not registered on WhatsApp.`, { ScheduleId: item.ScheduleId, WhatsappNo: item.WhatsappNo });
        }
    } catch (error) {
        logger.error(`Failed to process message ScheduleId: ${item.ScheduleId}.`, error);
        try {
            await op.updateDeliveryStatus(item.ScheduleId, op.MESSAGE_STATUS.FAILED_NOT_REGISTERED, 'Processing Failed');
        } catch (dbError) {
            logger.error(`Failed to update status for failed message ScheduleId: ${item.ScheduleId}.`, dbError);
        }
    }
}

async function sendScheduledMessages() {
    try {
        const messages = await op.readScheduleMessage();
        if (messages.length > 0) {
            logger.info(`Found ${messages.length} message(s) to send.`);
            await Promise.all(messages.map(processSingleMessage));
        }
    } catch (error) {
        logger.error('Error fetching and processing scheduled messages:', error);
    }
}

const pollingInterval = process.env.POLLING_INTERVAL_MS || 10000;
let timerId;

async function schedule() {
    try {
        await sendScheduledMessages();
    } catch (error) {
        logger.error('An unexpected error occurred in the scheduler:', error);
    } finally {
        timerId = setTimeout(schedule, pollingInterval);
    }
}

function start() {
    logger.info(`Scheduler starting. Polling interval: ${pollingInterval}ms.`);
    schedule();
}

function stop() {
    if (timerId) {
        clearTimeout(timerId);
        logger.info('Scheduler stopped.');
    }
}

module.exports = { start, stop };
