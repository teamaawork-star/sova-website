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
// Формируем информативную тему письма
$subject = "⚡️ Новая запись: " . $data['name'] . " (" . $data['date'] . " в " . $data['time'] . ")";

// Заголовки (From должен быть на вашем домене sova-sarov.ru)
$headers = "From: info@" . $site_domain . "\r\n" .
           "Reply-To: info@" . $site_domain . "\r\n" .
           "MIME-Version: 1.0\r\n" .
           "Content-Type: text/plain; charset=utf-8\r\n" .
           "X-Priority: 1 (Highest)\r\n"; // Помечает письмо как важное

// Текст письма
$email_text = "🦉 Студия SOVA\n\n" .
              "Поступила новая заявка через сайт.\n" .
              "----------------------------------\n" .
              "Клиент: " . $data['name'] . "\n" .
              "Телефон: " . $data['phone'] . "\n" .
              "Услуга: " . $data['service'] . "\n" .
              "Дата: " . $data['date'] . "\n" .
              "Время: " . $data['time'] . "\n" .
              "----------------------------------\n" .
              "Заявка уже сохранена в базе данных и доступна в админ-панели.";

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