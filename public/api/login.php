<?php
header('Content-Type: application/json');

// Получаем пароль, который ввел пользователь на сайте
$data = json_decode(file_get_contents('php://input'), true);

// ==========================================
// НАСТРОЙКА: ВАШ СЕКРЕТНЫЙ ПАРОЛЬ
// Он хранится только на сервере, браузер его не видит!
// ==========================================
$secret_password = 'wVxVVS4k'; 

if (isset($data['password']) && $data['password'] === $secret_password) {
    // Пароль совпал — даем зеленый свет
    echo json_encode(['status' => 'success']);
} else {
    // Пароль не совпал — возвращаем ошибку
    echo json_encode(['status' => 'error', 'message' => 'Неверный пароль']);
}
?>