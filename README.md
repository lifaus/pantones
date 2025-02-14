# Pantones

AI to generate random images and get their color palette, the same technology uses K-means clustering to get colors. And sending the finished result to the Telegram channel.

## 🚀 Usage

1. Install dependencies
```sh
npm install
```

2. Create ```.env``` file and add Telegram Bot Token & CHAT_ID
```
TELEGRAM_BOT_TOKEN=your_access_token
CHAT_ID=your_chat_id
```

3. Start generate image
```sh
npm start
```

## Features
- Fetches an image from a given URL
- Extracts the dominant colors using k-means clustering
- Generates a final image that includes the original image, color palette

## 🛠 Technologies Used
- Node.js
- Sharp (image processing)
- ml-kmeans (color clustering)
- Axios (fetching images)
- FS & Path (file handing)

## Example
![Example](docs/example.jpg)
