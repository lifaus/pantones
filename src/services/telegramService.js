import TelegramBot from 'node-telegram-bot-api';
import config from '../utils/config.js';
import fs from 'fs/promises';

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: false });

async function sendImageToTelegram(imagePath) {
    try {
        await bot.sendPhoto(config.CHAT_ID, imagePath);
        await fs.unlink(imagePath);
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
    }
}

export { sendImageToTelegram };
