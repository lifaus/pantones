import config from './utils/config.js';
import { fetchImage, extractColors, generateImageWithPalette } from './services/imageService.js';
import { sendImageToTelegram } from './services/telegramService.js';

async function main() {
    try {
        console.log('Downloading random picture..');
        const imageBuffer = await fetchImage(config.IMAGE_SOURCE_URL);

        console.log('Extracting colors...');
        const palette = await extractColors(imageBuffer);

        console.log('Create image with pallete...');
        const finalImagePath = await generateImageWithPalette(imageBuffer, palette);

        console.log('Sending to Telegram chat...');
        await sendImageToTelegram(finalImagePath);

        console.log('✅ Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
