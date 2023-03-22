<?php

class Telegram
{
    private string $secure_key;
    const API_URL = 'https://api.telegram.org';
    public int $update_id = 0;

    public function __construct(string $secure_key = '')
    {
        $this->secure_key = $secure_key;
    }

    public function sendPhoto(string $chat_id, string $document_path, string $caption = "", ?array $inline_keyboard = null): bool
    {
        $curl_file = curl_file_create($document_path);

        $params = [
            'chat_id' => $chat_id,
            'caption' => $caption,
            'photo' => $curl_file,
            'parse_mode' => 'HTML',
        ];

        if (!is_null($inline_keyboard)) {
            $inline_keyboard_markup = json_encode([
                'inline_keyboard' => $inline_keyboard,
            ]);

            $params['reply_markup'] = $inline_keyboard_markup;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, self::API_URL . "/bot{$this->secure_key}/sendPhoto");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = json_decode(curl_exec($ch), true);

        curl_close($ch);

        return isset($result['ok']) && $result['ok'];
    }
}
