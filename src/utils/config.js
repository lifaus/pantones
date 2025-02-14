import dotenv from 'dotenv';
dotenv.config();

export default {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    CHAT_ID: process.env.CHAT_ID,
    IMAGE_SOURCE_URL: 'https://picsum.photos/1500/1300'
};
