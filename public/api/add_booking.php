<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['name']) && !empty($data['phone'])) {
    try {
        // 1. Сохраняем в базу данных MySQL
        $stmt = $pdo->prepare('INSERT INTO bookings (name, phone, service, date, time, endTime, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['name'], 
            $data['phone'], 
            $data['service'], 
            $data['date'], 
            $data['time'], 
            $data['endTime'], 
            $data['status'], 
            $data['createdAt']
        ]);
        
        $insertId = $pdo->lastInsertId();

        // ==========================================
        // НАСТРОЙКИ УВЕДОМЛЕНИЙ
        // ==========================================
        $tg_bot_token = '8735094167:AAFaRMvmgSTphkkacOH3EBLbGC6Tz3w49_I';
        $tg_chat_id   = '273152721'; // Ваш ID или Екатерины
        $admin_email  = 'oleg96medvedev@yandex.ru'; // Почта, куда будут приходить заявки
        $site_domain  = 'sova-sarov.ru'; 

        // Формируем красивый текст сообщения
        $message_text = "🦉 <b>Новая запись с сайта!</b>\n\n" .
                        "👤 <b>Имя:</b> " . $data['name'] . "\n" .
                        "📞 <b>Телефон:</b> " . $data['phone'] . "\n" .
                        "💆‍♀️ <b>Услуга:</b> " . $data['service'] . "\n" .
                        "📅 <b>Время:</b> " . $data['date'] . " в " . $data['time'];

        // 2. Отправка в Telegram (используем @ чтобы скрыть ошибки, если TG заблокирован)
        $tg_url = "https://api.telegram.org/bot" . $tg_bot_token . "/sendMessage?chat_id=" . $tg_chat_id . "&parse_mode=HTML&text=" . urlencode($message_text);
        @file_get_contents($tg_url);

        // 3. Отправка на Email
        // Важно: на Timeweb почта отправителя (From) должна быть на вашем домене, иначе письмо улетит в спам
        $subject = 'Новая запись - SOVA';
        $headers = "From: info@" . $site_domain . "\r\n" .
                   "Reply-To: info@" . $site_domain . "\r\n" .
                   "Content-Type: text/plain; charset=utf-8\r\n";
        
        // Для почты убираем HTML-теги, оставляем чистый текст
        $email_text = strip_tags($message_text);
        @mail($admin_email, $subject, $email_text, $headers);

        // Отдаем ответ React-приложению
        echo json_encode(['status' => 'success', 'id' => $insertId]);

    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Empty fields']);
}
?>