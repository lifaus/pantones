import sharp from 'sharp';
import { kmeans } from 'ml-kmeans';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const FONT_BOLD = path.join('../fonts', 'Montserrat-Bold.ttf');
const FONT_MEDIUM = path.join('fonts', 'Montserrat-Medium.ttf');

async function fetchImage(url) {
    const response = await axios({ url, responseType: 'arraybuffer' });
    return response.data;
}

async function extractColors(imageBuffer, numColors = 5) {
    const image = sharp(imageBuffer).resize(200, 200, { fit: 'inside' });
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    const pixels = [];
    for (let i = 0; i < data.length; i += info.channels) {
        pixels.push([data[i], data[i + 1], data[i + 2]]);
    }

    const result = kmeans(pixels, numColors);
    return result.centroids.map(color => ({
        r: Math.round(color[0]),
        g: Math.round(color[1]),
        b: Math.round(color[2])
    }));
}

async function generateImageWithPalette(imageBuffer, palette) {
    const image = sharp(imageBuffer);
    const { width, height } = await image.metadata();

    const blockHeight = 100;
    const blockWidth = palette.length * 100;

    const blocks = await Promise.all(palette.map(({ r, g, b }) =>
        sharp({ create: { width: 100, height: blockHeight, channels: 3, background: { r, g, b } } }).png().toBuffer()
    ));

    const paletteImage = await sharp({ create: { width: blockWidth, height: blockHeight, channels: 3, background: 'white' } })
        .composite(blocks.map((buffer, i) => ({ input: buffer, left: i * 100, top: 0 })))
        .png()
        .toBuffer();

    const finalHeight = (height + blockHeight) + 200;
    const finalWidth = width;

    let finalImage = await sharp({ create: { width: finalWidth, height: finalHeight, channels: 3, background: 'white' } })
        .composite([
            { input: imageBuffer, left: (finalWidth - width) / 2, top: 0 },
            { input: paletteImage, left: 30, top: 1450 },
            { input: Buffer.from(
                `<svg width="${finalWidth}" height="200">
                    <style>
                        @font-face { font-family: 'BoldFont'; src: url('${FONT_BOLD}'); }
                        @font-face { font-family: 'MediumFont'; src: url('${FONT_MEDIUM}'); }
                    </style>
                    <text x="30" y="100" font-size="100" font-family="BoldFont" font-weight="900" fill="black">PANTONEL</text>
                    <text x="${finalWidth - 300}" y="150" font-size="50" font-family="MediumFont" fill="black">@pantonel</text>
                </svg>`
            ),
            top: 1320,
            left: 0 }
        ])
        .png()
        .toBuffer();

    const filePath = path.join('output', `${Date.now()}.png`);
    await fs.writeFile(filePath, finalImage);
    return filePath;
}

export { fetchImage, extractColors, generateImageWithPalette };
