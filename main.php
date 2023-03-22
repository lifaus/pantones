<?php

include('./lib/telegram/Telegram.php');


$telegram = new Telegram('your_telegram_bot_api_key');
$chat_id = -1001708796540;

$imageUrl = 'https://random.imagecdn.app/1500/1300?q=80&fm=jpg&crop=entropy';
$image = new Imagick();
$image->readImage($imageUrl);

$colors = 5;
$image->quantizeImage($colors, Imagick::COLORSPACE_RGB, 0, false, false);
$palette = $image->getImageHistogram();
$hexCodes = array();
foreach ($palette as $color) {
    $hexCodes[] = $color->getColorAsString();
}

$blockHeight = 100;
$blockWidth = 100 * $colors;
$block = new Imagick();
$block->newImage($blockWidth, $blockHeight, new ImagickPixel('white'));

$text = "";
for ($i = 0; $i < $colors; $i++) {
    $color = new ImagickPixel($hexCodes[$i]);
    $rectangle = new Imagick();
    $rectangle->newImage($blockHeight, $blockHeight, $color);
    $block->compositeImage($rectangle, Imagick::COMPOSITE_ATOP, $i * $blockHeight, 0);
}


$imageWidth = $image->getImageWidth();
$imageHeight = $image->getImageHeight();
$canvas = new Imagick();
$canvas->newImage($imageWidth, ($imageHeight + $blockWidth) - 230, new ImagickPixel('white'));
$canvas->compositeImage($image, Imagick::COMPOSITE_OVER, 0, 0);
$canvas->compositeImage($block, Imagick::COMPOSITE_OVER, 30, 1450);

$draw = new ImagickDraw();
$draw->setFillColor('black');
$draw->setFontSize(100);
$draw->setFont('./fonts/Montserrat-Bold.ttf');
$canvas->annotateImage($draw, 30, 1410, 0, "PANTONEL");
$draw->setFont('./fonts/Montserrat-Medium.ttf');
$draw->setFontSize(50);

$canvas->annotateImage($draw, 1150, 1450, 0, "@pantonel");

$file_name = rand() . '.png';
$canvas->writeImage($file_name);


$telegram->sendPhoto($chat_id, $file_name);
unlink($file_name);
